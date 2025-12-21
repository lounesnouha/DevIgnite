import mongoose from 'mongoose';


const connectDB = async ()=> {
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log('the data base has been connected successfully')
    }catch(e){
        console.log('an error has occured when connecting to the db\n',e);
    }
}

export default connectDB;