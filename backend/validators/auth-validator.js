const {z} = require('zod');

const signUpValidator = z.object({
    username: z.string({required_error: "Username is required"}).min(3,{message:"Username must be 3 character long"}).max(20 ,{message:"Username must not be more than 20 character long"}), 


    
    password: z.string({required_error: "Password is required"}).min(6,{message:"Password length should be 6 or greater"}).max(20,{message:"Password length should be 20 or less"}),
    name: z.string({required_error: "Name is required"}).min(3, {message:"Name should be 3 character long"}).max(50, {message:"Name should not be more than 50 character long"}),
    email: z.string({required_error: "Email is required"}).email(),
});

module.exports = {signUpValidator};