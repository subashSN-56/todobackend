require('dotenv').config();
const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("DB connected ..atlas.....");
}).catch((err) => {
    console.log(err);
});



const todoschema = new mongoose.Schema({
    
    title: {
        required:true,
        type:String
    },
    description:String
})


const todomodel = mongoose.model('Todo',todoschema);

//send data.............................................................................................

app.post("/todos",async (req, res) => {
    const { title, description } = req.body;

    // const newtodo = {
    //     id: todos.length + 1,
    //     title,
    //     description,
    // };
    // todos.push(newtodo);
    // console.log(todos);
    try {
        const newTodossave = new todomodel({title,description});
        await newTodossave.save();
        res.status(201).json(newTodossave);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({massage:error.massage})      
    }  
});
//update mothod ..........................................................................
app.put("/todos/:id", async (req, res) => {
    try {
      const { title, description } = req.body;
      const id = req.params.id;
  
      const updated = await todomodel.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ message: "Todo not found" });
      }
  
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });
  

//delete mothed .......................................................
app.delete("/todos/:id", async (req, res) => {
    try {
      const id = req.params.id;
  
      const deleted = await todomodel.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ message: "Todo not found" });
      }
  
      res.json({ message: "Todo deleted", todo: deleted });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });
  

//get mothod ............................................................................
app.get('/todos',async (req, res) => {
    try {
        const todoss= await todomodel.find();
        res.json(todoss);

    } catch (error) {
        console.log(error);
        res.status(500).json({massage:error.massage}) ;

    }
});


app.listen(port, () => {
    console.log(`server is ready on port ${port}`);
});

