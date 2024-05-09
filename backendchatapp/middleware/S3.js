const { S3Client,PutObjectCommand,DeleteObjectCommand,GetObjectCommand } =  require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const dotenv = require("dotenv")
dotenv.config()

 const bucketName = process.env.bucketName
const region = process.env.region
const accessKeyId = process.env.accessKeyId
const secretAccessKey = process.env.secretAccessKey

const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  })

// const cloudfront = new CloudFrontClient({
//     region,
//     credentials:{
//         accessKeyId:accessKeyId,
//         secretAccessKey:secretAccessKey,
//     }
// })
exports.uploadFile =(fileBuffer, fileName, mimetype)=>{
    const uploadParams = {
        Bucket: bucketName,
        Body: fileBuffer,
        Key: fileName,
        ContentType: mimetype
      }
return s3Client.send(new PutObjectCommand(uploadParams));
}

exports.deleteFile =(fileName)=>{
    const deleteParams = {
        Bucket: bucketName,
        Key: fileName,
      }
return s3Client.send(new DeleteObjectCommand(deleteParams));
}


exports.getObjectSignedUrl =async(key)=>{
    const params = {
        Bucket: bucketName,
        Key: key
      }
      const command = new GetObjectCommand(params);
      const seconds = 200
      const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });
      return url
}



