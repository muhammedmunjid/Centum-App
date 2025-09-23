const db = require('../config/connection');
const collection = require('../config/collection');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { response } = require('../app');


module.exports = {
    getClass: () => {
        return new Promise(async (resolve, reject) => {
          try {
            let classes = await db.get().collection(collection.STUDENT_COLLECTION).distinct('studentClass');
            resolve(classes);
          } catch (err) {
            reject(err);
          }
        });
      },

      doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {
                let student = await db.get().collection(collection.STUDENT_COLLECTION).findOne({
                    LastName: userData.LastName
                });
    
                if (!student) {
                    return resolve({
                        status: false,
                        message: 'Student not found'
                    });
                }
    
                let studentclass = student.studentClass;
                console.log('this is the student class:', studentclass);
    
                // Delete student from student collection
                await db.get().collection(collection.STUDENT_COLLECTION).deleteOne({ LastName: userData.LastName });
    
                // Hash password
                userData.Password = await bcrypt.hash(userData.Password, 10);
    
                let collectionName = null;
    
                switch (studentclass) {
                    case 'E1':
                        collectionName = collection.E1_COLLECTION;
                        break;
                    case 'E2':
                        collectionName = collection.E2_COLLECTION;
                        break;
                    case 'E3':
                        collectionName = collection.E3_COLLECTION;
                        break;
                    case 'E4':
                        collectionName = collection.E4_COLLECTION;
                        break;
                    case 'MB3':
                        collectionName = collection.MB3_COLLECTION;
                        break;
                    case 'M3':
                        collectionName = collection.M3_COLLECTION;
                        break;
                    case 'M4':
                        collectionName = collection.M4_COLLECTION;
                        break;
                    case 'MMB':
                        collectionName = collection.MMB_COLLECTION;
                        break;
                    default:
                        return resolve({
                            status: false,
                            message: 'Student class not recognized'
                        });
                }
    
                // Insert into appropriate class collection
                let result = await db.get().collection(collectionName).insertOne(userData);
                db.get().collection(collection.USER_COLLECTION).insertOne(userData);
    
                resolve({
                    status: true,
                    message: 'Signup successful',
                    _id: result.insertedId,
                    ...userData
                });
    
            } catch (err) {
                reject(err);
            }
        });
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const collectionsToSearch = [
                    collection.USER_COLLECTION,
                    collection.E1_COLLECTION,
                    collection.E2_COLLECTION,
                    collection.E3_COLLECTION,
                    collection.E4_COLLECTION,
                    collection.M3_COLLECTION,
                    collection.M4_COLLECTION,
                    collection.MMB_COLLECTION,
                    collection.MB3_COLLECTION
                ];
    
                let user = null;
                let foundInCollection = null;
    
                for (let collName of collectionsToSearch) {
                    user = await db.get().collection(collName).findOne({ Email: userData.Email });
                    if (user) {
                        foundInCollection = collName;
                        break;
                    }
                }
    
                if (!user) {
                    console.log('User not found');
                    return resolve({
                        status: false,
                        message: 'User not found'
                    });
                }
    
                const isMatch = await bcrypt.compare(userData.Password, user.Password);
                if (isMatch) {
                    console.log('Login success from collection:', foundInCollection);
                    return resolve({
                        status: true,
                        user: user,
                        message: 'Login successful'
                    });
                } else {
                    console.log('Incorrect password');
                    return resolve({
                        status: false,
                        message: 'Incorrect password'
                    });
                }
            } catch (err) {
                reject(err);
            }
        });
    }    
    ,
}