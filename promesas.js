const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');


const url = 'mongodb://localhost:27017'; 
const dbName = 'bdbitware'; 
const collectionName = 'promesas'; 

async function processCsvAndSaveToMongo(filePath) {
    const client = new MongoClient(url);

    try {
        
        await client.connect();
        console.log('Conectado a la base de datos');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        
        const results = [];
        
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    console.log('Archivo CSV procesado');
                    resolve();
                })
                .on('error', (error) => {
                    reject(error);
                });
        });

        
        const insertResult = await collection.insertMany(results);
        console.log(`${insertResult.insertedCount} documentos insertados en MongoDB`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('Conexión cerrada');
    }
}

const filePath = 'C:/apps/e-bitware/promesas/promesas_csv/StudentPerformanceFactors.csv'; 
processCsvAndSaveToMongo(filePath);
