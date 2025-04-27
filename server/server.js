const express=require('express')
const dotenv=require('dotenv')
const helmet=require('helmet')
const morgan=require('morgan')
const authRoutes=require('./routes/auth')
const dashboardRoutes=require('./routes/dash')
const CORS=require('cors')

const app=express()
dotenv.config()

app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(CORS())

console.log(authRoutes)

// app.get('/',(req,res)=>{
//     res.send('Hello World')
// }
// )


app.use('/api/auth',authRoutes)
app.use('/api/dashboard',dashboardRoutes)

console.log(process.env.PORT)

const port=process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`server is running on port ${port} ...`)
})