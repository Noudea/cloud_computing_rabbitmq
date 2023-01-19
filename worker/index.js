import amqplib from "amqplib";
import mongoose from 'mongoose'
import * as dotenv from "dotenv";
import Commande from './Commande.js'

dotenv.config();

// connect mongodb
mongoose.connect(process.env.DATABASE_URL, {}, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Connected to MongoDB");
  }
})

//setup rabbitmq
const rabbitMqConnection = (function(){
  try {
    let instance
    async function createConnection() {
      return await amqplib.connect(process.env.RABBITMQ_URL)
    }
    return {
      getInstance: async function() {
        if(!instance) {
          instance = await createConnection()
        }
        return instance
      }
    }
  } catch(error) {
    console.log(error)
  }
})()
const rabbitMqChannel = (function(){
  try {
    let instance
    async function createChannel() {
      const connection = await rabbitMqConnection.getInstance()
      return connection.createChannel()
    }

    return {
      getInstance: async function() {
        if(!instance) {
          instance = await createChannel()
        }
        return instance
      }
    }
  } catch (error) {
    console.log(error)
  }
})()

const rabbitmq = {
  connection: await rabbitMqConnection.getInstance(),
  channel: await rabbitMqChannel.getInstance(),
  init: async function() {
    try {
      const [queueName, exchangeName, routingKeyName] = new Array(3).fill("commande")
      const channel = this.channel
      //Create exchange
      await channel.assertExchange(exchangeName,'direct', {durable: true})
      console.log(`Exchange ${exchangeName} created`)
      //Create queue
      await channel.assertQueue(queueName, {durable: true})
      console.log(`Queue ${queueName} created`)
      //Bind queue to exchange
      await channel.bindQueue(queueName,exchangeName,routingKeyName)
      console.log(`Queue ${queueName} binded to exchange ${exchangeName} with routing key ${routingKeyName}`)
    } catch (error) {
      console.log(error)
    }
  },
  commandeWorker: async function() {
    try {
      const channel = await rabbitMqChannel.getInstance()
      await channel.consume("commande", (msg) => {
        if (msg !== null) {
          const { id ,action } = JSON.parse(msg.content)
          if(action === "process commande") {
            Commande.findByIdAndUpdate(id, {status: "delivered"}, {new: true}, (error, data) => {
              if(error) {
                console.log(error)
              }
              if(data) {
                console.log('Commande delivered')
              }
            })
          }
          channel.ack(msg);
        } else {
          console.log('Consumer cancelled by server');
        }
      });
    } catch (error) {
      console.log(error)
    }
  }
}


await rabbitmq.init()
await rabbitmq.commandeWorker()
