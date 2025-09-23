var express = require('express');
var router = express.Router();
var adminHelpers = require('../helpers/admin-helpers');
const collection = require('../config/collection');
const db = require("../config/connection");
const { getISTDateKey } = require("../helpers/date-helpers");
const dateKey = getISTDateKey();



/* GET home page. */
router.get('/', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  res.render('admin/admin-home', { admin: true, usersCount });
});

router.get('/options', function (req, res, next) {
  res.render('admin/admin-options', { admin: true });
});

router.get('/about', function (req, res, next) {
  res.render('admin/admin-about', { admin: true });
});

router.get('/add-students', function (req, res, next) {
  res.render('admin/admin-add-students', { admin: true });
});

router.post('/add-students', (req, res, next) => {
  const { LastName, studentClass } = req.body;
  console.log('Student added:', LastName, studentClass);
  adminHelpers.addStudent(req.body).then((response) => {
    console.log(response);
    res.redirect('/admin/add-students');
  });
});

router.get('/classes/E1', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsE1();
  res.render('admin/admin-classes-E1', { admin: true, usersCount, studentdetails });
});

router.get('/classes/E2', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsE2();
  res.render('admin/admin-classes-E2', { admin: true, usersCount, studentdetails });
});

router.get('/classes/E3', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsE3();
  res.render('admin/admin-classes-E3', { admin: true, usersCount, studentdetails });
});

router.get('/classes/E4', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsE4();
  res.render('admin/admin-classes-E4', { admin: true, usersCount, studentdetails });
});

router.get('/classes/MB3', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsMB3();
  res.render('admin/admin-classes-MB3', { admin: true, usersCount, studentdetails });
});

router.get('/classes/M3', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsM3();
  res.render('admin/admin-classes-M3', { admin: true, usersCount, studentdetails });
});

router.get('/classes/M4', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsM4();
  res.render('admin/admin-classes-M4', { admin: true, usersCount, studentdetails });
});

router.get('/classes/MMB', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsMMB();
  res.render('admin/admin-classes-MMB', { admin: true, usersCount, studentdetails });
});

router.get('/mark-attendance', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();

  // Get today's attendance summary
  const summary = await adminHelpers.getTodaySummary('E1'); // 🔥 new helper

  res.render('admin/admin-mark-attendance', {
    admin: true,
    usersCount,
    presentCount: summary.present,
    absentCount: summary.absent,
    totalCount: summary.total,
    currentDate: summary.dateKey
  });
});


router.get('/mark-attendance/E1', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsE1();
  res.render('admin/admin-mark-attendance-E1', { admin: true, usersCount, studentdetails });
});

router.get('/mark-attendance/E2', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsE2();
  res.render('admin/admin-mark-attendance-E2', { admin: true, usersCount, studentdetails });
});

router.get('/mark-attendance/E3', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsE3();
  res.render('admin/admin-mark-attendance-E3', { admin: true, usersCount, studentdetails });
});

router.get('/mark-attendance/E4', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsE4();
  res.render('admin/admin-mark-attendance-E4', { admin: true, usersCount, studentdetails });
});

router.get('/mark-attendance/MB3', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsMB3();
  res.render('admin/admin-mark-attendance-MB3', { admin: true, usersCount, studentdetails });
});

router.get('/mark-attendance/M3', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsM3();
  res.render('admin/admin-mark-attendance-M3', { admin: true, usersCount, studentdetails });
});

router.get('/mark-attendance/M4', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsM4();
  res.render('admin/admin-mark-attendance-M4', { admin: true, usersCount, studentdetails });
});

router.get('/mark-attendance/MMB', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetailsMMB();
  res.render('admin/admin-mark-attendance-MMB', { admin: true, usersCount, studentdetails });
});

// Mark PRESENT (E1)
router.get('/mark-present-E1/:id/:name', async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');

    const summary = await adminHelpers.markAttendance(
      studentId,
      studentName,
      'E1',
      'present'
    );

    // ✅ Return JSON instead of rendering a new page
    res.json({
      success: true,
      presentCount: summary.present,
      absentCount: summary.absent,
      totalCount: summary.total,
      dateKey: summary.dateKey
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});




router.get('/mark-present-E2/:id/:name', async (req, res, next ) => {
  try {
    const studentId = req.params.id;
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');

    const summary = await adminHelpers.markAttendance(
      studentId,
      studentName,
      'E2',
      'present'
    );

    // ✅ Return JSON instead of rendering a new page
    res.json({
      success: true,
      presentCount: summary.present,
      absentCount: summary.absent,
      totalCount: summary.total,
      dateKey: summary.dateKey
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/mark-present-E3/:id/:name', async (req, res, next ) => {
  try {
    const studentId = req.params.id;
    // Decode "First_Last" -> "First Last"
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');
    const summary = await adminHelpers.markAttendance(studentId, studentName, 'E3', 'present');

    // Option A: re-render the page with fresh counts (keeps your current flow)
    res.render('admin/admin-mark-attendance-E3', {
      admin: true,
      presentCount: summary.present,
      absentCount: summary.absent,
      totalCount: summary.total,
      currentDate: summary.dateKey
    });

    // Option B (recommended UX): redirect back to the E1 attendance page
    // res.redirect('/admin/mark-attendance-E1');
  } catch (err) {
    next(err);
  }
});

router.get('/mark-present-E4/:id/:name', async (req, res, next ) => {
  try {
    const studentId = req.params.id;
    // Decode "First_Last" -> "First Last"
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');
    const summary = await adminHelpers.markAttendance(studentId, studentName, 'E4', 'present');

    // Option A: re-render the page with fresh counts (keeps your current flow)
    res.render('admin/admin-mark-attendance-E4', {
      admin: true,
      presentCount: summary.present,
      absentCount: summary.absent,
      totalCount: summary.total,
      currentDate: summary.dateKey
    });

    // Option B (recommended UX): redirect back to the E1 attendance page
    // res.redirect('/admin/mark-attendance-E1');
  } catch (err) {
    next(err);
  }
});

router.get('/mark-present-M3/:id/:name', async (req, res, next ) => {
  try {
    const studentId = req.params.id;
    // Decode "First_Last" -> "First Last"
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');
    const summary = await adminHelpers.markAttendance(studentId, studentName, 'M3', 'present');

    // Option A: re-render the page with fresh counts (keeps your current flow)
    res.render('admin/admin-mark-attendance-M3', {
      admin: true,
      presentCount: summary.present,
      absentCount: summary.absent,
      totalCount: summary.total,
      currentDate: summary.dateKey
    });

    // Option B (recommended UX): redirect back to the E1 attendance page
    // res.redirect('/admin/mark-attendance-E1');
  } catch (err) {
    next(err);
  }
});

router.get('/mark-present-M4/:id/:name', async (req, res, next ) => {
  try {
    const studentId = req.params.id;
    // Decode "First_Last" -> "First Last"
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');
    const summary = await adminHelpers.markAttendance(studentId, studentName, 'M4', 'present');

    // Option A: re-render the page with fresh counts (keeps your current flow)
    res.render('admin/admin-mark-attendance-M4', {
      admin: true,
      presentCount: summary.present,
      absentCount: summary.absent,
      totalCount: summary.total,
      currentDate: summary.dateKey
    });

    // Option B (recommended UX): redirect back to the E1 attendance page
    // res.redirect('/admin/mark-attendance-E1');
  } catch (err) {
    next(err);
  }
});

router.get('/mark-present-MB3/:id/:name', async (req, res, next ) => {
  try {
    const studentId = req.params.id;
    // Decode "First_Last" -> "First Last"
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');
    const summary = await adminHelpers.markAttendance(studentId, studentName, 'MB3', 'present');

    // Option A: re-render the page with fresh counts (keeps your current flow)
    res.render('admin/admin-mark-attendance-MB3', {
      admin: true,
      presentCount: summary.present,
      absentCount: summary.absent,
      totalCount: summary.total,
      currentDate: summary.dateKey
    });

    // Option B (recommended UX): redirect back to the E1 attendance page
    // res.redirect('/admin/mark-attendance-E1');
  } catch (err) {
    next(err);
  }
});

router.get('/mark-present-MMB/:id/:name', async (req, res, next ) => {
  try {
    const studentId = req.params.id;
    // Decode "First_Last" -> "First Last"
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');
    const summary = await adminHelpers.markAttendance(studentId, studentName, 'MMB', 'present');

    // Option A: re-render the page with fresh counts (keeps your current flow)
    res.render('admin/admin-mark-attendance-MMB', {
      admin: true,
      presentCount: summary.present,
      absentCount: summary.absent,
      totalCount: summary.total,
      currentDate: summary.dateKey
    });

    // Option B (recommended UX): redirect back to the E1 attendance page
    // res.redirect('/admin/mark-attendance-E1');
  } catch (err) {
    next(err);
  }
});

// Mark ABSENT (E1)
router.get('/mark-absent-E1/:id/:name', async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');
    const summary = await adminHelpers.markAttendance(studentId, studentName, 'E1', 'absent');

    res.json({
      success: true,
      totalCount: summary.total,
      presentCount: summary.present,
      absentCount: summary.absent,
      currentDate: summary.dateKey
    });
  } catch (err) {
    next(err);
  }
});


router.get('/mark-absent-E2/:id/:name', async (req, res, next ) => {
  try {
    const studentId = req.params.id;
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');
    const summary = await adminHelpers.markAttendance(studentId, studentName, 'E2', 'absent');

    res.json({
      success: true,
      totalCount: summary.total,
      presentCount: summary.present,
      absentCount: summary.absent,
      currentDate: summary.dateKey
    });
  } catch (err) {
    next(err);
  }
});

router.get('/mark-absent-E3/:id/:name', async (req, res, next ) => {
  try {
    const studentId = req.params.id;
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');
    const summary = await adminHelpers.markAttendance(studentId, studentName, 'E3', 'absent');

    res.render('admin/admin-mark-attendance-E3', {
      admin: true,
      presentCount: summary.present,
      absentCount: summary.absent,
      totalCount: summary.total,
      currentDate: summary.dateKey
    });

    // Or: res.redirect('/admin/mark-attendance-E1');
  } catch (err) {
    next(err);
  }
});

router.get('/mark-absent-E4/:id/:name', async (req, res, next ) => {
  try {
    const studentId = req.params.id;
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');
    const summary = await adminHelpers.markAttendance(studentId, studentName, 'E4', 'absent');

    res.render('admin/admin-mark-attendance-E4', {
      admin: true,
      presentCount: summary.present,
      absentCount: summary.absent,
      totalCount: summary.total,
      currentDate: summary.dateKey
    });

    // Or: res.redirect('/admin/mark-attendance-E1');
  } catch (err) {
    next(err);
  }
});

router.get('/mark-absent-M3/:id/:name', async (req, res, next ) => {
  try {
    const studentId = req.params.id;
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');
    const summary = await adminHelpers.markAttendance(studentId, studentName, 'M3', 'absent');

    res.render('admin/admin-mark-attendance-M3', {
      admin: true,
      presentCount: summary.present,
      absentCount: summary.absent,
      totalCount: summary.total,
      currentDate: summary.dateKey
    });

    // Or: res.redirect('/admin/mark-attendance-E1');
  } catch (err) {
    next(err);
  }
});

router.get('/mark-absent-M4/:id/:name', async (req, res, next ) => {
  try {
    const studentId = req.params.id;
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');
    const summary = await adminHelpers.markAttendance(studentId, studentName, 'M4', 'absent');

    res.render('admin/admin-mark-attendance-M4', {
      admin: true,
      presentCount: summary.present,
      absentCount: summary.absent,
      totalCount: summary.total,
      currentDate: summary.dateKey
    });

    // Or: res.redirect('/admin/mark-attendance-M4');
  } catch (err) {
    next(err);
  }
});

router.get('/mark-absent-MB3/:id/:name', async (req, res, next ) => {
  try {
    const studentId = req.params.id;
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');
    const summary = await adminHelpers.markAttendance(studentId, studentName, 'MB3', 'absent');

    res.render('admin/admin-mark-attendance-MB3', {
      admin: true,
      presentCount: summary.present,
      absentCount: summary.absent,
      totalCount: summary.total,
      currentDate: summary.dateKey
    });

    // Or: res.redirect('/admin/mark-attendance-E1');
  } catch (err) {
    next(err);
  }
});

router.get('/mark-absent-MMB/:id/:name', async (req, res, next ) => {
  try {
    const studentId = req.params.id;
    const studentName = decodeURIComponent(req.params.name).replace(/_/g, ' ');
    const summary = await adminHelpers.markAttendance(studentId, studentName, 'MMB', 'absent');

    res.render('admin/admin-mark-attendance-MMB', {
      admin: true,
      presentCount: summary.present,
      absentCount: summary.absent,
      totalCount: summary.total,
      currentDate: summary.dateKey
    });

    // Or: res.redirect('/admin/mark-attendance-E1');
  } catch (err) {
    next(err);
  }
});


router.get('/all-students', async function (req, res, next) {
  let usersCount = await adminHelpers.getUsersCount();
  let studentdetails = await adminHelpers.getStudentDetails();
  res.render('admin/admin-all-students', { admin: true, usersCount, studentdetails });
});

// Lock attendance for today
// ✅ Correct
router.post('/lock-attendance/:className', async (req, res) => {
  try {
    const className = req.params.className;
    const dateKey = getISTDateKey();
    const dbConn = db.get();

    await dbConn.collection(collection.DAILY_LOCK_COLLECTION).updateOne(
      { class: className, dateKey },
      { $set: { locked: true, lockedAt: new Date() } },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error locking attendance:", err);
    res.json({ success: false, error: err.message });
  }
});


// Middleware to block access if locked
async function checkLock(req, res, next) {
  const locked = await adminHelpers.isAttendanceLocked("E1");
  if (locked) {
    return res.render("admin/attendance-locked", {
      admin: true,
      message: "You have already marked attendance today."
    });
  }
  next();
}

// Apply middleware to mark-attendance page
router.get('/mark-attendance-E1', checkLock, async (req, res) => {
  let students = await adminHelpers.getAllStudents("E1");
  res.render('admin/admin-mark-attendance-E1', { 
    admin: true,
    studentdetails: students,
    currentDate: getISTDateKey()
  });
});


module.exports = router;
