import mongoose,{Schema, SchemaType} from 'mongoose';


const EmployeeSchema = new Schema(
    {
        id:{
            type:Number,
            required:true,
        },
        employeeName:{
            type:String,
            required:true,
        },
        firstName:{
            type:String,
            required:true,
        },
        lastName:{
            type:String,
            required:true,
        },
        employeeId:{
            type:String,
        },
        workEmail:{
            type:String,
        },
        homePhoneNumber:{
            type:Number,
        },
        workMobilePhone:{
            type:Number,
        },
        workPhone:{
            type:Number,
        },
        personalMobilePhone:{
            type:Number,
        },
        Department:{
            type:String,
        },
        portalUser:{
            type:Boolean,
        },
        portalLoginName:{
            type:String,
        },
        updatedBy:{
            type:Schema.Types.ObjectId,
            ref:'User',
        }
    },
    {timestamps:true}
);


const Employee = mongoose.model('Employee',EmployeeSchema);
export default Employee;