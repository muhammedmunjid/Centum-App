const db = require('../config/connection');
const collection = require('../config/collection');
const { ObjectId } = require('mongodb');
const { response } = require('../app');
const { getISTDateKey } = require("./date-helpers");
const dateKey = getISTDateKey();


module.exports = {
    addStudent: (studentData) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.STUDENT_COLLECTION).insertOne(studentData).then((data) => {
                resolve(data);
            });
        });
    },

    getUsersCount: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const dbConn = db.get();
      
            const counts = await Promise.all([
              dbConn.collection(collection.E1_COLLECTION).countDocuments(),
              dbConn.collection(collection.E2_COLLECTION).countDocuments(),
              dbConn.collection(collection.E3_COLLECTION).countDocuments(),
              dbConn.collection(collection.E4_COLLECTION).countDocuments(),
              dbConn.collection(collection.MB3_COLLECTION).countDocuments(),
              dbConn.collection(collection.M3_COLLECTION).countDocuments(),
              dbConn.collection(collection.M4_COLLECTION).countDocuments(),
              dbConn.collection(collection.MMB_COLLECTION).countDocuments(),
              dbConn.collection(collection.USER_COLLECTION).countDocuments(),
            ]);
      
            resolve({
              E1: counts[0],
              E2: counts[1],
              E3: counts[2],
              E4: counts[3],
              MB3: counts[4],
              M3: counts[5],
              M4: counts[6],
              MMB: counts[7],
              USER: counts[8]
            });
          } catch (err) {
            reject(err);
          }
        });
      },

      getStudentDetailsE1: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const dbConn = db.get();
            const students = await dbConn.collection(collection.E1_COLLECTION).find().toArray();
            resolve(students);
          } catch (err) {
            reject(err);
          }
        });
      },

      getStudentDetailsE2: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const dbConn = db.get();
            const students = await dbConn.collection(collection.E2_COLLECTION).find().toArray();
            resolve(students);
          } catch (err) {
            reject(err);
          }
        });
      },

      getStudentDetailsE3: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const dbConn = db.get();
            const students = await dbConn.collection(collection.E3_COLLECTION).find().toArray();
            resolve(students);
          } catch (err) {
            reject(err);
          }
        });
      },

      getStudentDetailsE4: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const dbConn = db.get();
            const students = await dbConn.collection(collection.E4_COLLECTION).find().toArray();
            resolve(students);
          } catch (err) {
            reject(err);
          }
        });
      },

      getStudentDetailsMB3: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const dbConn = db.get();
            const students = await dbConn.collection(collection.MB3_COLLECTION).find().toArray();
            resolve(students);
          } catch (err) {
            reject(err);
          }
        });
      },

      getStudentDetailsM3: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const dbConn = db.get();
            const students = await dbConn.collection(collection.M3_COLLECTION).find().toArray();
            resolve(students);
          } catch (err) {
            reject(err);
          }
        });
      },

      getStudentDetailsM4: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const dbConn = db.get();
            const students = await dbConn.collection(collection.M4_COLLECTION).find().toArray();
            resolve(students);
          } catch (err) {
            reject(err);
          }
        });
      },

      getStudentDetailsMMB: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const dbConn = db.get();
            const students = await dbConn.collection(collection.MMB_COLLECTION).find().toArray();
            resolve(students);
          } catch (err) {
            reject(err);
          }
        });
      },

      getStudentDetails: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const dbConn = db.get();
            const students = await dbConn.collection(collection.USER_COLLECTION).find().toArray();
            resolve(students);
          } catch (err) {
            reject(err);
          }
        });
      },

  /**
   * Mark attendance for a student for *today* (IST).
   * Upserts one doc per (studentId, class, dateKey).
   * Returns today's summary counts for that class.
   */
markAttendance: (studentId, studentName, className, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dbConn = db.get();
      const coll = status === 'present'
        ? dbConn.collection(collection.ATTENDANCE_COLLECTION)
        : dbConn.collection(collection.ABSENT_COLLECTION);

      const dateKey = getISTDateKey(); // ✅ Now works

      await coll.updateOne(
        { studentId: new ObjectId(studentId), class: className, dateKey },
        {
          $set: {
            studentName,
            class: className,
            dateKey,
            status,
            markedAt: new Date()
          }
        },
        { upsert: true }
      );

      // Summary
      const dbPresent = dbConn.collection(collection.ATTENDANCE_COLLECTION);
      const dbAbsent = dbConn.collection(collection.ABSENT_COLLECTION);

      const [present, absent] = await Promise.all([
        dbPresent.countDocuments({ class: className, dateKey }),
        dbAbsent.countDocuments({ class: className, dateKey })
      ]);

      resolve({ dateKey, present, absent, total: present + absent });
    } catch (err) {
      reject(err);
    }
  });
}
  ,

  getTodaySummary: (className) => {
    return new Promise(async (resolve, reject) => {
      try {
        const dbConn = db.get();
        const dateKey = getISTDateKey();
  
        const [present, absent] = await Promise.all([
          dbConn.collection(collection.ATTENDANCE_COLLECTION).countDocuments({ class: className, dateKey }),
          dbConn.collection(collection.ABSENT_COLLECTION).countDocuments({ class: className, dateKey })
        ]);
  
        const total = present + absent;
        resolve({ dateKey, present, absent, total });
      } catch (err) {
        reject(err);
      }
    });
  },

  // helpers/admin-helpers.js
lockAttendance: (className) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dbConn = db.get();
      const dateKey = getISTDateKey();

      // Upsert lock record
      await dbConn.collection(collection.DAILY_LOCK_COLLECTION).updateOne(
        { class: className, dateKey },
        { $set: { locked: true, lockedAt: new Date() } },
        { upsert: true }
      );

      resolve({ success: true, dateKey });
    } catch (err) {
      reject(err);
    }
  });
},

isAttendanceLocked: async (className) => {
  const dbConn = db.get();
  const dateKey = getISTDateKey();
  const lock = await dbConn.collection(collection.DAILY_LOCK_COLLECTION)
    .findOne({ class: className, dateKey, locked: true });
  return !!lock;
},



  
}