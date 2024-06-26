const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Schema } = mongoose;
const cors = require('cors'); // Import cors 
const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const Class = require('./models/class');
const Subject = require('./models/subject');
const Homework = require('./models/homework');
const FeePayment = require('./models/feePayment');
const Razorpay = require('razorpay');
const shortid = require('shortid');
const SchoolDetails = require('./models/schoolDetails');



const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://arpan:arpan@cluster0.ff9rlfk.mongodb.net/school', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// MongoDB schema and model
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    schoolName: String,
    schoolIndexId: String,
    userRole: String
}, { collection: 'principal' });

const User = mongoose.model('principal', userSchema);

// Routes
app.post('/api/signup', async(req, res) => {
    try {
        const { firstName, lastName, email, password, schoolName, schoolIndexId, userRole } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user with hashed password
        const newUser = new User({ firstName, lastName, email, password, schoolName, schoolIndexId, userRole });
        await newUser.save();

        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Signup failed' });
    }
});

app.post('/api/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });

        if (user && user.password.toString() === password) {
            // If the user is found in the User collection, set userrole as 'principal'
            res.status(200).json({ message: 'Login successful', user, userrole: 'principal' });
            return;
        }

        // If user is not found in the User collection, check in the Teacher collection
        const teacher = await Teacher.findOne({ email });
        if (teacher && teacher.password.toString() === password) {
            // If the user is found in the Teacher collection and the password matches, set userrole as 'teacher'
            res.status(200).json({ message: 'Login successful', user: teacher, userrole: 'teacher', eml: email });
            return;
        }
        const student = await Student.findOne({ email });
        if (student && student.password.toString() === password) {
            // If the user is found in the Teacher collection and the password matches, set userrole as 'teacher'
            res.status(200).json({ message: 'Login successful', user: student, userrole: 'student', eml: email });
            return;
        }
        // If user is neither in User nor in Teacher collection, or password doesn't match, return error
        res.status(401).json({ message: 'Invalid email or password' });
    } catch (error) {
        console.error('Login failed:', error.message);
        res.status(500).json({ message: 'Login failed' });
    }
});


const teacherSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    degree: String,
    subject: String,
    contactNo: { type: String, unique: true },
    email: { type: String, unique: true },
    password: Number,
    principal: String,
    userRole: String,
    photo: String
}, { collection: 'teacher' });

const Teacher = mongoose.model('Teacher', teacherSchema);

// Routes
app.post('/api/add-teachers', async(req, res) => {
    try {
        const { firstName, lastName, degree, subject, contactNo, email, password, principal, userRole, photo } = req.body; // Include password in the request body
        const newTeacher = new Teacher({ firstName, lastName, degree, subject, contactNo, email, password, principal, userRole, photo }); // Include password in the Teacher model
        await newTeacher.save();
        res.status(201).json(newTeacher);
    } catch (error) {
        console.error('Error adding teacher:', error);
        res.status(500).json({ message: 'Failed to add teacher' });
    }
});

app.get('/api/fetch-teachers', async(req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Failed to fetch teachers' });
    }
});


app.get('/api/fetch-teacher-by-email', async(req, res) => {
    try {
        const { email } = req.query;
        const teacher = await Teacher.findOne({ email });
        res.status(200).json(teacher);
    } catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({ message: 'Failed to fetch teacher' });
    }
});

// Fetch attendance by teacherId
app.get('/api/fetch-attendance-by-teacherId', async(req, res) => {
    try {
        const { teacherId } = req.query;
        const attendance = await Attendance.find({ teacherId });
        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Failed to fetch attendance' });
    }
});



// const classSchema = new mongoose.Schema({
//     className: { type: String, unique: true },
//     classTeacher: String,
//     roomNo: { type: String, unique: true },
//     capacity: Number,
//     principal: String,
//     feeAmount: Number
// }, { collection: 'class' });

// // Create model using the schema
// const Class = mongoose.model('Class', classSchema);





app.post('/api/add-class', async(req, res) => {
    try {
        const { className, classTeacher, roomNo, capacity } = req.body;
        const newClass = new Class({ className, classTeacher, roomNo, capacity });
        await newClass.save();
        res.status(201).json(newClass);
    } catch (error) {
        console.error('Error adding class:', error);
        res.status(500).json({ message: 'Failed to add class' });
    }
});

// Endpoint to fetch all classes
app.get('/api/fetch-class', async(req, res) => {
    try {
        const classes = await Class.find();
        res.status(200).json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ message: 'Failed to fetch classes' });
    }
});

app.post('/api/delete-classes', async(req, res) => {
    try {
        const { classIds } = req.body;
        await Class.deleteMany({ _id: { $in: classIds } });
        res.status(200).json({ message: 'Classes deleted successfully' });
    } catch (error) {
        console.error('Error deleting classes:', error);
        res.status(500).json({ message: 'Failed to delete classes' });
    }
});

app.get('/api/fetchStbyEmail', async(req, res) => {
    try {
        const { email } = req.query;
        const student = await Student.findOne({ email });
        if (student) {
            res.status(200).json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student by email:', error);
        res.status(500).json({ message: 'Failed to fetch student' });
    }
});

app.get('/api/fetch-class-by-name', async(req, res) => {
    const { className } = req.query;

    try {
        const classDetails = await Class.findOne({ className }).exec();
        res.status(200).json(classDetails);
    } catch (error) {
        console.error('Error fetching class details:', error);
        res.status(500).json({ message: 'Failed to fetch class details' });
    }
});
app.get('/api/class/:classId', async(req, res) => {
    try {
        const { classId } = req.params;
        const classInfo = await Class.findById(classId);
        if (classInfo) {
            res.status(200).json(classInfo);
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        console.error('Error fetching class:', error);
        res.status(500).json({ message: 'Failed to fetch class' });
    }
});

const studentSchema = new mongoose.Schema({
    rollNo: { type: Number },
    firstName: String,
    middleName: String,
    lastName: String,
    gender: String,
    contactNo: String,
    email: String,
    birthdate: Date,
    childUid: { type: Number, unique: true },
    classId: String,
    password: String,
    principal: String,
    userRole: String,
    photo: String
}, { collection: 'student' });
const Student = mongoose.model('Student', studentSchema);


// Assuming you have already defined '/api/add-student' endpoint
app.post('/api/add-student', async(req, res) => {
    try {
        const { rollNo, firstName, middleName, lastName, gender, contactNo, email, birthdate, childUid, classId, password, principal, userRole, photo } = req.body;

        // Create new student
        const newStudent = new Student({ rollNo, firstName, middleName, lastName, gender, contactNo, email, birthdate, childUid, classId, password, principal, userRole, photo });
        await newStudent.save();
        sendCredentialsEmail(newStudent);

        // Create fee payment record for the student
        const studentClass = await Class.findById(classId);
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + 1); // Example: set due date to one month from now

        const feePayment = new FeePayment({
            studentId: newStudent._id,
            classId: studentClass._id,
            dueDate,
            amount: studentClass.feeAmount, // Assuming fee amount is stored in Class model
        });

        await feePayment.save();

        res.status(201).json({ newStudent, feePayment });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Failed to add student' });
    }
});

async function sendCredentialsEmail(student) {
    try {
        // Create a transporter using SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'arpanrupareliya238@gmail.com',
                pass: 'tlzf jcgh xptg fqzl',
            },
        });

        // Compose email
        let mailOptions = {
            from: '"Arpan Rupareliya" <arpanrupareliya238@gmail.com>',
            to: student.email,
            subject: 'Credentials',
            text: `Hello ${student.firstName} ${student.lastName},\n\n` +
                `Credentials of your School:\n` +
                `Email ID: ${student.email}\n` +
                `Password: ${student.password}\n`,
        };

        // Send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}


app.get('/api/fetch-students', async(req, res) => {
    try {
        const { classId } = req.query;
        console.log(`Fetching students for classId: ${classId}`); // Log the classId

        const students = await Student.find({ classId });
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Failed to fetch students' });
    }
});

app.get('/api/fetch-students-for-marks', async(req, res) => {
    try {
        const { classId } = req.query;
        console.log(`Fetching students for classId: ${classId}`);

        const students = await Student.find({ classId });
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Failed to fetch students' });
    }
});

app.delete('/api/delete-students', async(req, res) => {
    const { studentIds } = req.body;

    try {
        // Use Mongoose $in operator to find and delete multiple students by their IDs
        const deleteResult = await Student.deleteMany({ _id: { $in: studentIds } });

        if (deleteResult.deletedCount > 0) {
            res.status(200).json({ message: `${deleteResult.deletedCount} students deleted successfully` });
        } else {
            res.status(404).json({ message: 'No students found to delete' });
        }
    } catch (error) {
        console.error('Error deleting students:', error);
        res.status(500).json({ message: 'Failed to delete students' });
    }
});
app.post('/api/delete-classes', async(req, res) => {
    try {
        const { classIds, reassignToClassId } = req.body;

        if (reassignToClassId) {
            await Student.updateMany({ classId: { $in: classIds } }, { classId: reassignToClassId });
        } else {
            await Student.deleteMany({ classId: { $in: classIds } });
        }

        await Class.deleteMany({ _id: { $in: classIds } });

        res.status(200).json({ message: 'Classes deleted successfully' });
    } catch (error) {
        console.error('Error deleting classes:', error);
        res.status(500).json({ message: 'Failed to delete classes' });
    }
});
app.get('/api/fetch-student-by-email', async(req, res) => {
    try {
        const { email } = req.query;
        const student = await Student.findOne({ email });
        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student by email:', error);
        res.status(500).json({ message: 'Failed to fetch student' });
    }
});

// // Assuming you have already defined '/api/fetch-attendance-by-studentId' endpoint
// app.get('/api/fetch-attendance-by-studentId', async(req, res) => {
//   try {
//       const { studentId } = req.query;
//       const attendance = await Attendance.find({ 'students.studentId': studentId });
//       res.status(200).json(attendance);
//   } catch (error) {
//       console.error('Error fetching attendance:', error);
//       res.status(500).json({ message: 'Failed to fetch attendance' });
//   }
// });







// const subjectSchema = new mongoose.Schema({
//     class: String,
//     subjectName: String,
//     subjectCode: { type: String, unique: true }
// }, { collection: "subject" });

// const Subject = mongoose.model('Subject', subjectSchema);





app.post('/api/add-subject', async(req, res) => {
    const { class: selectedClass, subjectName, subjectCode } = req.body;
    try {
        const newSubject = new Subject({ class: selectedClass, subjectName, subjectCode });
        await newSubject.save();
        res.status(201).json({ message: 'Subject added successfully' });
    } catch (error) {
        console.error('Error adding subject:', error);
        res.status(500).json({ message: 'Error adding subject' });
    }
});

// Fetch Subjects by Class endpoint
app.get('/api/subjectss', async(req, res) => {
    try {
        const { class: className } = req.query;
        const subjects = await Subject.find({ class: className });
        res.status(200).json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ message: 'Error fetching subjects' });
    }
});




app.get('/api/subjectsByClassName', async(req, res) => {
    try {
        const { className } = req.query;
        const subjects = await Subject.find({ class: className });
        res.status(200).json(subjects);
    } catch (error) {
        console.error('Error fetching subjects by className:', error);
        res.status(500).json({ message: 'Error fetching subjects' });
    }
});

app.get('/api/show-subjects', async(req, res) => {
    try {
        const className = req.query.className;
        const subjects = await Subject.find({ class: className });

        res.status(200).json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ message: 'Error fetching subjects' });
    }
});
const timetableSchema = new mongoose.Schema({
    date: Date,
    periods: [{
        srNo: Number,
        from: String,
        to: String,
        subject: String,
        teacher: String
    }],
    selectedClass: String // Adding selectedClass field to the schema
}, { collection: "timetable" });

// Define a model for the timetable collection
const Timetable = mongoose.model('Timetable', timetableSchema);

app.post('/api/timetable', (req, res) => {
    const { date, periods, selectedClass } = req.body;

    // Create a new timetable document
    const newTimetable = new Timetable({
        date,
        periods,
        selectedClass // Adding selectedClass to the document
    });

    // Save the timetable document to the database
    newTimetable.save()
        .then(() => res.status(201).json({ message: 'Timetable saved successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/api/timetable/:teacherEmail/:selectedDate', async(req, res) => {
    try {
        const { teacherEmail, selectedDate } = req.params;

        // Find the teacher by email
        const teacher = await Teacher.findOne({ email: teacherEmail });

        if (!teacher) {
            console.log("teacher n maila.");
            return res.status(404).json({ message: "Teacher not found." });
        }

        // Get the full name of the teacher
        const teacherFullName = `${teacher.firstName} ${teacher.lastName}`;

        // Find the timetable based on teacher's full name and selected date
        const timetable = await Timetable.findOne({ 'periods.teacher': teacherFullName, date: selectedDate });

        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found for the selected date and teacher." });
        }

        res.json(timetable);
    } catch (error) {
        console.error('Error fetching timetable:', error);
        res.status(500).json({ message: "Internal server error" });
    }

});


app.get('/api/teacher/:email', async(req, res) => {
    try {
        const { email } = req.params;
        const teacher = await Teacher.findOne({ email });

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found." });
        }

        res.json({
            firstName: teacher.firstName,
            lastName: teacher.lastName
        });
    } catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const fileUpload = require('express-fileupload');
app.use(fileUpload());

const imageSchema = new mongoose.Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    imageData: {
        type: String,
        required: true,
    },
}, { collection: "image" });

const Image = mongoose.model('Image', imageSchema);

// Endpoint for adding an image
app.post('/api/addImage', async(req, res) => {
    try {

        const { eventId } = req.query;
        console.log(eventId);

        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: 'No image uploaded' });
        }


        const imageFile = req.files.image;
        const imageData = imageFile.data.toString('base64');

        // Create a new image document
        const newImage = new Image({
            eventId: eventId,
            imageData: imageData,
        });

        // Save the image document to the database
        await newImage.save();

        res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
});


app.get('/api/timetable/pt/:selectedClass/:date', async(req, res) => {
    const { selectedClass, date } = req.params;

    try {
        console.log("selectedClass" + date);
        const timetable = await Timetable.findOne({ selectedClass, date });
        if (!timetable) {

            return res.status(404).json({ message: 'Timetable not found' });
        }
        res.status(200).json(timetable);
    } catch (error) {
        console.error('Error fetching timetable:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Endpoint for retrieving images
app.get('/api/getImages', async(req, res) => {
    try {
        const { eventId } = req.query;

        // Check if eventId is provided
        if (!eventId) {
            return res.status(400).json({ message: 'Event ID is required' });
        }

        // Retrieve images for the specific event from the database
        const images = await Image.find({ eventId });

        res.status(200).json({ images });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Failed to fetch images' });
    }
});




app.post('/api/add-fees', async(req, res) => {
    try {
        const { className, amount } = req.body;
        // You can perform validation and other checks here
        // For simplicity, assuming className is unique
        const classData = await Class.findOne({ className });
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }
        // Update the class with the fee amount
        classData.feeAmount = amount;
        await classData.save();
        res.status(200).json({ message: 'Fees added successfully' });
    } catch (error) {
        console.error('Error adding fees:', error);
        res.status(500).json({ message: 'Failed to add fees' });
    }
});
app.get('/api/fetch-fees', async(req, res) => {
    try {
        // Assuming you have a model named Fee to fetch fees
        const classdata = await Class.find();
        res.status(200).json(classdata);
    } catch (error) {
        console.error('Error fetching fees:', error);
        res.status(500).json({ message: 'Failed to fetch fees' });
    }
});

const syllabusSchema = new mongoose.Schema({
    className: { type: String, required: true },
    subjectName: { type: String, required: true },
    syllabus: { type: String, required: true }
}, { collection: 'syllabus' });

const Syllabus = mongoose.model('Syllabus', syllabusSchema);

app.get('/api/syllabus', async(req, res) => {
    try {
        const { className, subject } = req.query;
        const syllabus = await Syllabus.findOne({ className, subjectName: subject });
        if (syllabus) {
            res.status(200).json(syllabus);
        } else {
            res.status(404).json({ message: 'Syllabus not found' });
        }
    } catch (err) {
        console.error('Error fetching syllabus:', err);
        res.status(500).json({ message: 'Failed to fetch syllabus' });
    }
});

// Add syllabus
app.post('/api/add-syllabus', async(req, res) => {
    try {
        const { className, subject, syllabus } = req.body;
        const newSyllabus = new Syllabus({ className, subjectName: subject, syllabus });
        await newSyllabus.save();
        res.status(201).json(newSyllabus);
    } catch (err) {
        console.error('Error adding syllabus:', err);
        res.status(500).json({ message: 'Failed to add syllabus' });
    }
});

app.post('/api/send-email', async(req, res) => {
    const { email, subject, body } = req.body;

    try {
        // Create a transporter using SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Your SMTP server hostname
            port: 465, // Your SMTP server port
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'arpanrupareliya238@gmail.com', // Your email address
                pass: 'tlzf jcgh xptg fqzl', // Your email password
            },
        });

        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Arpan Rupareliya" arpanrupareliya238@gmail.com', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: body, // plain text body
        });

        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

//Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;


// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Endpoint to send SMS
app.post('/api/send-sms', async(req, res) => {
    const { phoneNumber, message } = req.body;

    try {
        // Validate that 'phoneNumber' is provided
        if (!phoneNumber) {
            throw new Error("A 'To' phone number is required.");
        }

        // Format the phone number with '+91' for Indian numbers
        const formattedPhoneNumber = '+91' + phoneNumber;

        // Send SMS using Twilio
        const twilioResponse = await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: formattedPhoneNumber,
        });

        console.log('SMS sent successfully:', twilioResponse.sid);
        res.status(200).json({ message: 'SMS sent successfully!' });
    } catch (error) {
        console.error('Error sending SMS:', error.message);
        res.status(500).json({ error: 'Failed to send SMS.' });
    }
});
const complaintSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: String,
});

const Complaint = mongoose.model('Complaint', complaintSchema);



app.post('/api/complaints', async(req, res) => {
    try {
        const { title, content } = req.body;
        const createdBy = req.headers.gmail; // Assuming gmail is sent in request header

        if (!createdBy) {
            return res.status(400).send('User not authenticated');
        }

        let imageData = '';
        if (req.files && req.files.image) {
            const imageFile = req.files.image;
            imageData = imageFile.data.toString('base64');

            // Create a new image document
            const newImage = new Image({
                imageData,
            });

            // Save the image document to the database
            await newImage.save();
        }



        const newComplaint = new Complaint({
            title,
            content,
            image: imageData,
            createdBy,
        });

        await newComplaint.save();

        res.status(200).send('Complaint saved successfully');
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.status(500).send('Failed to submit complaint');
    }
});
app.get('/api/fetch-complaints', async(req, res) => {
    // console.log("aaa");
    try {
        const complaints = await Complaint.find();
        res.status(200).json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ message: 'Failed to fetch complaints' });
    }
});

// Route to fetch a single complaint by ID
app.delete('/api/complaints/:id', async(req, res) => {
    try {
        const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);
        if (!deletedComplaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.status(200).json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        console.error('Error deleting complaint:', error);
        res.status(500).json({ message: 'Failed to delete complaint' });
    }
});

app.get('/api/fetchStudents', async(req, res) => {
    try {
        const { class: className } = req.query;
        console.log(className);

        const classInfo = await Class.findOne({ className: className });
        const cId = classInfo._id;

        const students = await Student.find({ classId: cId });

        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch students' });
    }
});


// app.get('/homeworkDetails', async(req, res) => {
//     try {
//         const { studentId, date, class: className } = req.query;

//         // Find the class by name
//         const classData = await Class.findOne({ className });
//         if (!classData) {
//             return res.status(404).json({ success: false, message: 'Class not found' });
//         }

//         // Convert date to the start and end of the day to match the date in the database
//         const startDate = new Date(date);
//         startDate.setHours(0, 0, 0, 0);
//         const endDate = new Date(date);
//         endDate.setHours(23, 59, 59, 999);

//         // Find homeworks for the class and date
//         const homeworks = await Homework.find({
//             classId: classData._id,
//             date: { $gte: startDate, $lte: endDate },
//             "submissions.studentId": studentId
//         }).populate('subjectId', 'subjectName').populate('submissions.studentId', 'name');

//         if (homeworks.length === 0) {
//             return res.json([]); // No homework given for the selected student, date, and class
//         }

//         // Map the homework details
//         const homeworkDetails = homeworks.map(homework => {
//             const studentSubmission = homework.submissions.find(sub => sub.studentId.toString() === studentId);
//             return {
//                 _id: homework._id,
//                 subjectName: homework.subjectId.subjectName,
//                 title: homework.title,
//                 description: homework.description,
//                 questionLink: homework.questionsLink,
//                 submissionStatus: studentSubmission ? {
//                     submissionDate: studentSubmission.submissionDate,
//                     submissionFile: studentSubmission.submissionFile
//                 } : null
//             };
//         });

//         res.json(homeworkDetails);
//     } catch (error) {
//         console.error('Error fetching homework details:', error);
//         res.status(500).json({ success: false, message: 'Failed to fetch homework details' });
//     }
// });

app.get('/api/fetchStudentClass', async(req, res) => {
    try {
        const { email } = req.query;
        console.log("emaillll");
        console.log(email);

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Find the class details by class ID
        const studentClass = await Class.findById(student.classId);
        if (!studentClass) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }
        console.log(studentClass);

        // Respond with the class details
        res.status(200).json({ success: true, classId: studentClass._id, className: studentClass.className });
    } catch (error) {
        console.error('Error fetching student class:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch student class' });
    }
});


app.get('/api/fetchStudentHomework', async(req, res) => {
    try {
        const { date, classId, email } = req.query;
        console.log(date);
        console.log(classId);
        console.log("hello");
        console.log(email);
        // Convert the date string to a Date object
        const selectedDate = new Date(date);

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        console.log(student);

        // Find homework assignments for the given date and class ID
        const homeworkList = await Homework.find({
            classId: classId,
            date: {
                $gte: selectedDate.setHours(0, 0, 0, 0),
                $lt: selectedDate.setHours(23, 59, 59, 999)
            }
        }).populate('subjectId', 'subjectName');

        console.log("after");
        console.log(homeworkList);

        if (!homeworkList || homeworkList.length === 0) {
            return res.status(404).json({ success: false, message: 'No homework found for the selected date and class' });
        }

        // Respond with the homework details
        const formattedHomeworkList = await Promise.all(homeworkList.map(async(homework) => {
            const subject = await Subject.findById(homework.subjectId);
            const submission = homework.submissions.find(sub => sub.studentId.toString() === student._id.toString());
            return {
                ...homework.toObject(),
                subjectName: subject ? subject.subjectName : '',
                isPending: !submission // If no submission, mark as pending
            };
        }));

        // Respond with the formatted homework details
        res.status(200).json({ success: true, homework: formattedHomeworkList });

    } catch (error) {
        console.error('Error fetching student homework:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch student homework' });
    }
});



app.post('/api/submitHomework', async(req, res) => {
    try {
        const { homeworkId, submissionLink, email } = req.body;

        // Validate inputs
        if (!homeworkId || !submissionLink || !email) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Find the student by email
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Find the homework by ID
        const homework = await Homework.findById(homeworkId);
        if (!homework) {
            return res.status(404).json({ success: false, message: 'Homework not found' });
        }

        // Check if the student has already submitted the homework
        const existingSubmission = homework.submissions.find(sub => sub.studentId.toString() === student._id.toString());

        if (existingSubmission) {
            return res.status(400).json({ success: false, message: 'Homework already submitted' });
        }

        // Add the new submission to the homework's submissions array
        const newSubmission = {
            studentId: student._id,
            submissionFile: submissionLink,
            submissionDate: new Date(),
            isPending: false
        };

        homework.submissions.push(newSubmission);

        // Update the pending status based on submissions
        // homework.isPending = homework.submissions.length === 0;

        await homework.save();

        res.status(200).json({ success: true, message: 'Homework submitted successfully' });

    } catch (error) {
        console.error('Error submitting homework:', error);
        res.status(500).json({ success: false, message: 'Failed to submit homework' });
    }
});


app.get('/api/homeworkDetails', async(req, res) => {
    try {
        const { date, class: className } = req.query;


        const classDocument = await Class.findOne({ className });
        // console.log(classDocument);
        if (!classDocument) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        const classId = classDocument._id;

        const homeworkDetails = await Homework.find({
            classId,
            date: {
                $gte: new Date(date), // Greater than or equal to the provided date
                $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) // Less than the next day
            },
        }).populate('submissions.studentId', 'firstName lastName');

        const processedHomeworkDetails = await Promise.all(homeworkDetails.map(async(homework) => {
            const subject = await Subject.findById(homework.subjectId);
            const subjectName = subject ? subject.subjectName : '';
            return {
                ...homework.toObject(),
                subjectName
            };
        }));

        // console.log(processedHomeworkDetails);

        res.status(200).json(processedHomeworkDetails);
    } catch (error) {
        console.error('Error fetching homework details:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch homework details' });
    }
});

app.get('/api/birthdays', async(req, res) => {
    try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // Months are 0-based in JS
        const currentDay = today.getDate();

        // Fetch students whose birthday is today (only comparing month and day)
        const students = await Student.aggregate([{
                $addFields: {
                    month: { $month: '$birthdate' },
                    day: { $dayOfMonth: '$birthdate' }
                }
            },
            {
                $match: {
                    month: currentMonth,
                    day: currentDay
                }
            }
        ]);

        // Fetch class names and attach to students
        const studentsWithClassNames = await Promise.all(
            students.map(async(student) => {
                const classDoc = await Class.findById(student.classId);
                return {
                    _id: student._id,
                    firstName: student.firstName,
                    middleName: student.middleName,
                    lastName: student.lastName,
                    birthdate: student.birthdate,
                    classId: student.classId,
                    className: classDoc ? classDoc.className : 'Unknown',
                    photo: student.photo
                };
            })
        );

        res.status(200).json(studentsWithClassNames);
    } catch (error) {
        console.error('Error fetching birthdays:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch birthdays' });
    }
});

const examScheduleSchema = new mongoose.Schema({
    class: String,
    date: Date,
    from: String,
    to: String,
    subject: String,
    frequency: String // Added frequency field
}, { collection: 'examSchedule' });

// Create ExamSchedule model
const ExamSchedule = mongoose.model('ExamSchedule', examScheduleSchema);

// Fetch schedules for a class
app.get('/api/fetch-schedule', async(req, res) => {
    const { class: className } = req.query;

    try {
        const schedules = await ExamSchedule.find({ class: className }).exec();

        res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ message: 'Failed to fetch schedules' });
    }
});

// Add new exam schedule
app.post('/api/add-exam-schedule', async(req, res) => {
    try {
        const { class: className, date, from, to, subject, frequency } = req.body;
        const newSchedule = new ExamSchedule({ class: className, date, from, to, subject, frequency });
        await newSchedule.save();
        res.status(200).json({ message: 'Exam schedule added successfully' });
    } catch (error) {
        console.error('Error adding exam schedule:', error);
        res.status(500).json({ message: 'Failed to add exam schedule' });
    }
});


app.get('/api/fetch-fee-details', async(req, res) => {
    const { studentId } = req.query;
    try {
        const feeDetails = await FeePayment.find({ studentId }).populate('classId');
        res.json(feeDetails);
    } catch (error) {
        console.error('Error fetching fee details:', error);
        res.status(500).json({ message: 'Failed to fetch fee details' });
    }
});

const examResultSchema = new mongoose.Schema({
    examScheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamSchedule' },
    examDate: Date,
    totalMarks: Number,
    studentResults: [{
        studentEmail: String,
        fullName: String, // Add fullName field
        marks: Number,
        absent: Boolean
    }]
}, { collection: 'examResults' });

const ExamResult = mongoose.model('ExamResult', examResultSchema);
app.post('/api/save-exam-results', async(req, res) => {
    const { examScheduleId, examDate, totalMarks, studentResults } = req.body;

    try {
        await ExamResult.findOneAndUpdate({ examScheduleId, examDate }, { totalMarks, studentResults }, { upsert: true, new: true, setDefaultsOnInsert: true });
        res.status(200).json({ message: 'Exam results saved successfully' });
    } catch (error) {
        console.error('Error saving exam results:', error);
        res.status(500).json({ message: 'Failed to save exam results' });
    }
});


app.get('/api/fetch-exam-results', async(req, res) => {
    const { examScheduleId } = req.query;

    try {
        const examResults = await ExamResult.find({ examScheduleId }).exec();

        res.status(200).json(examResults);
    } catch (error) {
        console.error('Error fetching exam results:', error);
        res.status(500).json({ error: 'Failed to fetch exam results' });
    }
});




app.get('/api/fetch-exam-results-for-exams', async(req, res) => {
    const { examIds } = req.query;
    const examIdsArray = examIds.split(',');

    try {
        const examResults = await ExamResult.find({ examScheduleId: { $in: examIdsArray } }).exec();
        res.status(200).json(examResults);
    } catch (error) {
        console.error('Error fetching exam results for exams:', error);
        res.status(500).json({ error: 'Failed to fetch exam results for exams' });
    }
});

app.get('/api/fetch-student-fees', async(req, res) => {
    const { studentId } = req.query;
    try {
        const feeDetails = await FeePayment.find({ studentId }).populate('classId');
        res.json(feeDetails);
    } catch (error) {
        console.error('Error fetching fee details:', error);
        res.status(500).json({ message: 'Failed to fetch fee details' });
    }
});


const razorpay = new Razorpay({
    key_id: 'rzp_test_UXwDn93TnrUjql',
    key_secret: '9snsccyX3BiS5pWZTAixOq8R',
});

app.post('/api/create-order', async(req, res) => {
    const { amount, studentId } = req.body; // Ensure you are sending studentId along with amount from frontend

    const options = {
        amount: amount * 100, // amount in smallest currency unit
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
        payment_capture: 1,
    };

    try {
        const response = await razorpay.orders.create(options);
        await FeePayment.findOneAndUpdate({ studentId, paymentStatus: 'Pending' }, { 'paymentDetails.orderId': response.id }, { new: true });
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong');
    }
});



app.post('/api/update-payment-status', async(req, res) => {
    const { studentId, orderId, paymentId, signature } = req.body;
    console.log("hello api", studentId, orderId, paymentId, signature); // Debug log

    try {
        const feeRecord = await FeePayment.findOne({ studentId, 'paymentDetails.orderId': orderId });
        if (!feeRecord) {
            console.log('Fee record not found'); // Debug log
            return res.status(404).send('Fee record not found');
        }

        // Update the payment details
        feeRecord.paymentStatus = 'Paid';
        feeRecord.paymentDetails = {
            orderId,
            paymentId,
            signature,
            paymentDate: new Date(),
        };

        await feeRecord.save();
        res.status(200).send('Payment status updated successfully');
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).send('Internal Server Error');
    }
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set the directory to save the files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get('/api/school-details', async(req, res) => {
    try {
        console.log("enter");
        const schoolDetails = await SchoolDetails.findOne(); // Assuming there's only one document
        res.json(schoolDetails);
    } catch (err) {
        console.error('Error fetching school details:', err);
        res.status(500).json({ error: 'Error fetching school details' });
    }
});

// Update school details
app.put('/api/school-details', upload.single('schoolLogo'), async(req, res) => {
    try {
        let formData = req.body;
        // console.log(formData);

        const schoolDetails = await SchoolDetails.findOne();

        if (schoolDetails) {
            schoolDetails.schoolLogo = formData.schoolLogo;
            schoolDetails.schoolName = formData.schoolName;
            schoolDetails.schoolEmail = formData.schoolEmail;
            schoolDetails.schoolAddress = formData.schoolAddress;
            schoolDetails.schoolContactNo = formData.schoolContactNo;
            schoolDetails.principalEmail = formData.principalEmail;

            await schoolDetails.save();

            res.json(schoolDetails);
        } else {
            res.status(404).json({ error: 'School details not found' });
        }


    } catch (err) {
        console.error('Error updating school details:', err);
        res.status(500).json({ error: 'Error updating school details' });
    }
});


app.get('/api/fetchTeacher', async(req, res) => {
    try {
        const teachers = await Teacher.find({}, 'firstName lastName'); // Fetch only firstName and lastName
        res.json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Failed to fetch teachers' });
    }
});


app.use('/api', require("./routes/saveNotice"));
app.use('/api', require('./routes/fetchNotice'));
app.use('/api', require('./routes/saveEvent'));
app.use('/api', require('./routes/fetchEvents'));
app.use('/api', require('./routes/fetchClasses'));
app.use('/api', require('./routes/fetchSubjects'));
app.use('/api', require('./routes/saveMaterial'));
app.use('/api', require('./routes/fetchmaterial'));
app.use('/api', require('./routes/attendance'));
app.use('/api', require('./routes/saveHomework'));
app.use('/api', require('./routes/showPrayer'));
app.use('/api', require('./routes/manageVideos'));


// app.use('/api', require('./routes/fetchStudentHomework'));
const teacherRoutes = require('./routes/attendanceTeacher');
app.use(teacherRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports.Class = Class;
module.exports.Subject = Subject;