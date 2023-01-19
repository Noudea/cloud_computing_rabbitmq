import mongoose from "mongoose";

const CommandeSchema = new mongoose.Schema({
  status: {
    type: String,
    enum : ['pending', 'delivered'],
    default: 'pending'
  }
},{
  timestamps: true
})

const Commande = mongoose.model('Commande',CommandeSchema)

export default Commande