const API_URL = 'http://localhost:2409/api';

let tokens = {
  admin: '',
  teacher: '',
  user: ''
};

let createdIds = {
  subjectId: '',
  questionId: '',
  examId: '',
  attemptId: '',
  userId: ''
};

const makeRequest = async (method, endpoint, data = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

const testAuth = async () => {
  console.log('\n=== TESTING AUTH ===');

  console.log('\n1. Login Admin...');
  const adminLogin = await makeRequest('POST', '/auth/login', {
    email: 'admin@demo.com',
    password: 'Admin@123'
  });
  console.log(`Status: ${adminLogin.status}`, adminLogin.data.message || '');
  if (adminLogin.data.token) {
    tokens.admin = adminLogin.data.token;
    console.log('✓ Admin token saved');
  }

  console.log('\n2. Login Teacher...');
  const teacherLogin = await makeRequest('POST', '/auth/login', {
    email: 'teacher@demo.com',
    password: 'Teacher@123'
  });
  console.log(`Status: ${teacherLogin.status}`, teacherLogin.data.message || '');
  if (teacherLogin.data.token) {
    tokens.teacher = teacherLogin.data.token;
    console.log('✓ Teacher token saved');
  }

  console.log('\n3. Login User...');
  const userLogin = await makeRequest('POST', '/auth/login', {
    email: 'user@demo.com',
    password: 'User@123'
  });
  console.log(`Status: ${userLogin.status}`, userLogin.data.message || '');
  if (userLogin.data.token) {
    tokens.user = userLogin.data.token;
    console.log('✓ User token saved');
  }

  console.log('\n4. Get Admin Profile...');
  const profile = await makeRequest('GET', '/auth/me', null, tokens.admin);
  console.log(`Status: ${profile.status}`);
  console.log('Profile:', profile.data.user);

  console.log('\n5. Register New User...');
  const register = await makeRequest('POST', '/auth/register', {
    fullName: 'Test User Registration',
    email: `testuser${Date.now()}@test.com`,
    password: 'Test@123'
  });
  console.log(`Status: ${register.status}`, register.data.message || '');
};

const testUsers = async () => {
  console.log('\n\n=== TESTING USER MANAGEMENT (Admin) ===');

  console.log('\n1. Get All Users...');
  const users = await makeRequest('GET', '/users?page=1&limit=5', null, tokens.admin);
  console.log(`Status: ${users.status}`);
  console.log(`Total Users: ${users.data.pagination?.total || 0}`);

  console.log('\n2. Create New User...');
  const newUser = await makeRequest('POST', '/users', {
    fullName: 'Test Created User',
    email: `created${Date.now()}@test.com`,
    password: 'Test@123',
    role: 'teacher'
  }, tokens.admin);
  console.log(`Status: ${newUser.status}`, newUser.data.message || '');
  if (newUser.data.user) {
    createdIds.userId = newUser.data.user.id;
    console.log('✓ Created User ID:', createdIds.userId);
  }

  if (createdIds.userId) {
    console.log('\n3. Update User...');
    const updateUser = await makeRequest('PUT', `/users/${createdIds.userId}`, {
      fullName: 'Updated User Name',
      role: 'user'
    }, tokens.admin);
    console.log(`Status: ${updateUser.status}`, updateUser.data.message || '');

    console.log('\n4. Lock User...');
    const lockUser = await makeRequest('PATCH', `/users/${createdIds.userId}/lock`, null, tokens.admin);
    console.log(`Status: ${lockUser.status}`, lockUser.data.message || '');

    console.log('\n5. Unlock User...');
    const unlockUser = await makeRequest('PATCH', `/users/${createdIds.userId}/unlock`, null, tokens.admin);
    console.log(`Status: ${unlockUser.status}`, unlockUser.data.message || '');
  }

  console.log('\n6. Search Users...');
  const search = await makeRequest('GET', '/users?search=admin&role=admin', null, tokens.admin);
  console.log(`Status: ${search.status}`);
  console.log(`Found: ${search.data.users?.length || 0} users`);
};

const testSubjects = async () => {
  console.log('\n\n=== TESTING SUBJECTS ===');

  console.log('\n1. Get All Subjects...');
  const subjects = await makeRequest('GET', '/subjects', null, tokens.admin);
  console.log(`Status: ${subjects.status}`);
  console.log(`Total Subjects: ${subjects.data.subjects?.length || 0}`);
  if (subjects.data.subjects && subjects.data.subjects.length > 0) {
    createdIds.subjectId = subjects.data.subjects[0]._id;
    console.log('✓ Using Subject ID:', createdIds.subjectId);
  }

  console.log('\n2. Create Subject...');
  const newSubject = await makeRequest('POST', '/subjects', {
    name: 'Test Subject',
    description: 'This is a test subject',
    status: 'active'
  }, tokens.admin);
  console.log(`Status: ${newSubject.status}`, newSubject.data.message || '');
  if (newSubject.data.subject) {
    createdIds.subjectId = newSubject.data.subject._id;
    console.log('✓ Created Subject ID:', createdIds.subjectId);
  }

  if (createdIds.subjectId) {
    console.log('\n3. Update Subject...');
    const updateSubject = await makeRequest('PUT', `/subjects/${createdIds.subjectId}`, {
      name: 'Updated Test Subject',
      description: 'Updated description'
    }, tokens.admin);
    console.log(`Status: ${updateSubject.status}`, updateSubject.data.message || '');
  }
};

const testQuestions = async () => {
  console.log('\n\n=== TESTING QUESTIONS ===');

  console.log('\n1. Get Questions (Teacher)...');
  const questions = await makeRequest('GET', '/questions?page=1&limit=5', null, tokens.teacher);
  console.log(`Status: ${questions.status}`);
  console.log(`Total Questions: ${questions.data.pagination?.total || 0}`);

  if (createdIds.subjectId) {
    console.log('\n2. Create Question (Teacher)...');
    const newQuestion = await makeRequest('POST', '/questions', {
      subjectId: createdIds.subjectId,
      content: 'What is 2 + 2?',
      options: {
        A: '3',
        B: '4',
        C: '5',
        D: '6'
      },
      correctOption: 'B'
    }, tokens.teacher);
    console.log(`Status: ${newQuestion.status}`, newQuestion.data.message || '');
    if (newQuestion.data.question) {
      createdIds.questionId = newQuestion.data.question._id;
      console.log('✓ Created Question ID:', createdIds.questionId);
    }

    if (createdIds.questionId) {
      console.log('\n3. Update Question (Teacher)...');
      const updateQuestion = await makeRequest('PUT', `/questions/${createdIds.questionId}`, {
        subjectId: createdIds.subjectId,
        content: 'What is 3 + 3?',
        options: {
          A: '5',
          B: '6',
          C: '7',
          D: '8'
        },
        correctOption: 'B'
      }, tokens.teacher);
      console.log(`Status: ${updateQuestion.status}`, updateQuestion.data.message || '');
    }
  }

  console.log('\n4. Search Questions...');
  const search = await makeRequest('GET', '/questions?search=question', null, tokens.teacher);
  console.log(`Status: ${search.status}`);
  console.log(`Found: ${search.data.questions?.length || 0} questions`);
};

const testExams = async () => {
  console.log('\n\n=== TESTING EXAMS ===');

  console.log('\n1. Get Exams (Teacher)...');
  const exams = await makeRequest('GET', '/exams?page=1&limit=5', null, tokens.teacher);
  console.log(`Status: ${exams.status}`);
  console.log(`Total Exams: ${exams.data.pagination?.total || 0}`);

  console.log('\n2. Get Questions for Exam...');
  const questions = await makeRequest('GET', '/questions?limit=3', null, tokens.teacher);
  const questionIds = questions.data.questions?.map(q => q._id) || [];
  console.log(`Available Questions: ${questionIds.length}`);

  if (createdIds.subjectId && questionIds.length > 0) {
    console.log('\n3. Create Exam (Teacher)...');
    const newExam = await makeRequest('POST', '/exams', {
      title: 'Test Exam',
      subjectId: createdIds.subjectId,
      questionIds: questionIds,
      timeLimit: 30
    }, tokens.teacher);
    console.log(`Status: ${newExam.status}`, newExam.data.message || '');
    if (newExam.data.exam) {
      createdIds.examId = newExam.data.exam._id;
      console.log('✓ Created Exam ID:', createdIds.examId);
    }

    if (createdIds.examId) {
      console.log('\n4. Publish Exam...');
      const publish = await makeRequest('PATCH', `/exams/${createdIds.examId}/publish`, null, tokens.teacher);
      console.log(`Status: ${publish.status}`, publish.data.message || '');

      console.log('\n5. Get Public Exams (User)...');
      const publicExams = await makeRequest('GET', '/exams/public?page=1', null, tokens.user);
      console.log(`Status: ${publicExams.status}`);
      console.log(`Public Exams: ${publicExams.data.pagination?.total || 0}`);

      console.log('\n6. Get Exam Detail (User)...');
      const examDetail = await makeRequest('GET', `/exams/${createdIds.examId}/public`, null, tokens.user);
      console.log(`Status: ${examDetail.status}`);
      if (examDetail.data.exam) {
        console.log(`Exam: ${examDetail.data.exam.title}`);
        console.log(`Questions: ${examDetail.data.exam.questionIds?.length || 0}`);
      }
    }
  }
};

const testAttempts = async () => {
  console.log('\n\n=== TESTING ATTEMPTS ===');

  if (createdIds.examId) {
    console.log('\n1. Get Exam Questions...');
    const examDetail = await makeRequest('GET', `/exams/${createdIds.examId}/public`, null, tokens.user);
    
    if (examDetail.data.exam && examDetail.data.exam.questionIds) {
      const answers = examDetail.data.exam.questionIds.map(q => ({
        questionId: q._id,
        selectedOption: 'A'
      }));

      console.log('\n2. Submit Attempt (User)...');
      const attempt = await makeRequest('POST', '/attempts', {
        examId: createdIds.examId,
        answers: answers
      }, tokens.user);
      console.log(`Status: ${attempt.status}`, attempt.data.message || '');
      if (attempt.data.attempt) {
        createdIds.attemptId = attempt.data.attempt._id;
        console.log('✓ Score:', attempt.data.attempt.score);
        console.log('✓ Attempt ID:', createdIds.attemptId);
      }
    }
  }

  console.log('\n3. Get My Attempts (User)...');
  const myAttempts = await makeRequest('GET', '/attempts/me', null, tokens.user);
  console.log(`Status: ${myAttempts.status}`);
  console.log(`Total Attempts: ${myAttempts.data.pagination?.total || 0}`);

  console.log('\n4. Get All Attempts (Teacher)...');
  const allAttempts = await makeRequest('GET', '/attempts', null, tokens.teacher);
  console.log(`Status: ${allAttempts.status}`);
  console.log(`Total Attempts: ${allAttempts.data.pagination?.total || 0}`);

  if (createdIds.attemptId) {
    console.log('\n5. Get Attempt Detail (Teacher)...');
    const attemptDetail = await makeRequest('GET', `/attempts/${createdIds.attemptId}`, null, tokens.teacher);
    console.log(`Status: ${attemptDetail.status}`);
    if (attemptDetail.data.attempt) {
      console.log(`Score: ${attemptDetail.data.attempt.score}`);
      console.log(`Answers: ${attemptDetail.data.attempt.answers?.length || 0}`);
    }
  }
};

const testExport = async () => {
  console.log('\n\n=== TESTING EXPORT (Admin) ===');

  console.log('\n1. Export Users...');
  const usersExport = await fetch(`${API_URL}/export/users.xlsx`, {
    headers: { 'Authorization': `Bearer ${tokens.admin}` }
  });
  console.log(`Status: ${usersExport.status}`);
  console.log(`Content-Type: ${usersExport.headers.get('content-type')}`);

  console.log('\n2. Export Exams...');
  const examsExport = await fetch(`${API_URL}/export/exams.xlsx`, {
    headers: { 'Authorization': `Bearer ${tokens.admin}` }
  });
  console.log(`Status: ${examsExport.status}`);
  console.log(`Content-Type: ${examsExport.headers.get('content-type')}`);

  console.log('\n3. Export Attempts...');
  const attemptsExport = await fetch(`${API_URL}/export/attempts.xlsx`, {
    headers: { 'Authorization': `Bearer ${tokens.admin}` }
  });
  console.log(`Status: ${attemptsExport.status}`);
  console.log(`Content-Type: ${attemptsExport.headers.get('content-type')}`);
};

const testCleanup = async () => {
  console.log('\n\n=== CLEANUP (Optional) ===');

  if (createdIds.userId) {
    console.log('\n1. Delete Created User...');
    const deleteUser = await makeRequest('DELETE', `/users/${createdIds.userId}`, null, tokens.admin);
    console.log(`Status: ${deleteUser.status}`, deleteUser.data.message || '');
  }

  if (createdIds.questionId) {
    console.log('\n2. Delete Created Question...');
    const deleteQuestion = await makeRequest('DELETE', `/questions/${createdIds.questionId}`, null, tokens.teacher);
    console.log(`Status: ${deleteQuestion.status}`, deleteQuestion.data.message || '');
  }

  if (createdIds.examId) {
    console.log('\n3. Delete Created Exam...');
    const deleteExam = await makeRequest('DELETE', `/exams/${createdIds.examId}`, null, tokens.teacher);
    console.log(`Status: ${deleteExam.status}`, deleteExam.data.message || '');
  }

  if (createdIds.subjectId) {
    console.log('\n4. Delete Created Subject...');
    const deleteSubject = await makeRequest('DELETE', `/subjects/${createdIds.subjectId}`, null, tokens.admin);
    console.log(`Status: ${deleteSubject.status}`, deleteSubject.data.message || '');
  }
};

const runTests = async () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   QUIZ/EXAM SYSTEM - API INTEGRATION TEST             ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  try {
    await testAuth();
    await testUsers();
    await testSubjects();
    await testQuestions();
    await testExams();
    await testAttempts();
    await testExport();
    await testCleanup();

    console.log('\n\n╔════════════════════════════════════════════════════════╗');
    console.log('║   ALL TESTS COMPLETED!                                 ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('\nCheck Swagger UI at: http://localhost:2409/api/docs');
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
  }
};

runTests();
