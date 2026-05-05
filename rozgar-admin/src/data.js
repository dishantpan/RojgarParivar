// ===== MOCK DATA FOR ADMIN PORTAL =====

export const STATS = {
  totalWorkers: 52840,
  totalHirers: 8320,
  totalJobs: 124650,
  completedJobs: 98430,
  pendingVerifications: 14,
  pendingReports: 7,
  newToday: { workers: 84, hirers: 23, jobs: 156 },
  weeklyActivity: [
    { day: 'Mon', workers: 62, jobs: 120 },
    { day: 'Tue', workers: 78, jobs: 145 },
    { day: 'Wed', workers: 54, jobs: 98  },
    { day: 'Thu', workers: 91, jobs: 167 },
    { day: 'Fri', workers: 84, jobs: 189 },
    { day: 'Sat', workers: 110, jobs: 210 },
    { day: 'Sun', workers: 45, jobs: 76  },
  ],
  cityActivity: [
    { city: 'Surat',      workers: 8420, jobs: 12400 },
    { city: 'Ahmedabad',  workers: 7230, jobs: 10800 },
    { city: 'Mumbai',     workers: 6900, jobs: 9800  },
    { city: 'Delhi',      workers: 5400, jobs: 8200  },
    { city: 'Bangalore',  workers: 4800, jobs: 7100  },
    { city: 'Pune',       workers: 3900, jobs: 5600  },
  ],
};

export const PENDING_BUSINESSES = [
  { id:'B001', company:'Mehta Construction Pvt Ltd', type:'Construction Company', owner:'Rajesh Mehta', city:'Surat', mobile:'+91 98765 43210', email:'rajesh@mehta.com', gst:'24AAAAA0000A1Z5', license:true,  appliedDate:'2024-11-10', yearsOld:8,  status:'pending' },
  { id:'B002', company:'Patel Manpower Services',    type:'Manpower Supplier',    owner:'Suresh Patel', city:'Ahmedabad', mobile:'+91 87654 32109', email:'suresh@patel.com', gst:'24BBBBB1111B2Y6', license:true,  appliedDate:'2024-11-11', yearsOld:5,  status:'pending' },
  { id:'B003', company:'Gujarat Warehousing Co',     type:'Warehouse / Logistics',owner:'Kiran Shah',  city:'Vadodara', mobile:'+91 76543 21098', email:'kiran@gwc.com',   gst:'24CCCCC2222C3X7', license:false, appliedDate:'2024-11-11', yearsOld:12, status:'pending' },
  { id:'B004', company:'Delhi Infra Builders',       type:'Real Estate / Builder', owner:'Amit Sharma', city:'Delhi',    mobile:'+91 65432 10987', email:'amit@dib.com',    gst:'07DDDDD3333D4W8', license:true,  appliedDate:'2024-11-12', yearsOld:3,  status:'pending' },
  { id:'B005', company:'Chennai Fabricators Ltd',    type:'Manufacturing Factory', owner:'Priya Nair',  city:'Chennai',  mobile:'+91 54321 09876', email:'priya@cfl.com',   gst:'33EEEEE4444E5V9', license:true,  appliedDate:'2024-11-12', yearsOld:15, status:'pending' },
  { id:'B006', company:'Star Labour Agency',         type:'Labour Contractor',    owner:'Vikram Singh',city:'Mumbai',   mobile:'+91 43210 98765', email:'vikram@star.com', gst:'27FFFFF5555F6U0', license:false, appliedDate:'2024-11-09', yearsOld:6,  status:'approved' },
  { id:'B007', company:'Jaipur Stone Works',         type:'Manufacturing Factory', owner:'Ramesh Kumar', city:'Jaipur', mobile:'+91 32109 87654', email:'ramesh@jsw.com',  gst:'08GGGGG6666G7T1', license:true,  appliedDate:'2024-11-08', yearsOld:20, status:'rejected' },
];

export const WORKERS = [
  { id:'W001', name:'Ramesh Kumar',   skill:'Mason',       city:'Surat',     mobile:'+91 98765 43210', age:32, rating:4.8, jobs:24, status:'active',    verified:true,  joined:'2024-09-01' },
  { id:'W002', name:'Suresh Patel',   skill:'Electrician', city:'Ahmedabad', mobile:'+91 87654 32109', age:28, rating:4.5, jobs:18, status:'active',    verified:true,  joined:'2024-09-15' },
  { id:'W003', name:'Mohan Das',      skill:'Plumber',     city:'Mumbai',    mobile:'+91 76543 21098', age:35, rating:4.2, jobs:31, status:'suspended', verified:true,  joined:'2024-08-20' },
  { id:'W004', name:'Priya Kumari',   skill:'Cook',        city:'Delhi',     mobile:'+91 65432 10987', age:30, rating:4.9, jobs:12, status:'active',    verified:false, joined:'2024-10-05' },
  { id:'W005', name:'Ajay Singh',     skill:'Driver',      city:'Jaipur',    mobile:'+91 54321 09876', age:40, rating:4.6, jobs:45, status:'active',    verified:true,  joined:'2024-07-12' },
  { id:'W006', name:'Deepak Yadav',   skill:'Welder',      city:'Pune',      mobile:'+91 43210 98765', age:27, rating:3.8, jobs:8,  status:'active',    verified:true,  joined:'2024-10-20' },
  { id:'W007', name:'Kavita Devi',    skill:'Housekeeping',city:'Bangalore', mobile:'+91 32109 87654', age:38, rating:4.7, jobs:29, status:'active',    verified:true,  joined:'2024-08-01' },
];

export const HIRERS = [
  { id:'H001', name:'Anita Shah',      type:'Regular',   city:'Surat',     mobile:'+91 91234 56789', email:'anita@gmail.com',   jobs:5,  status:'active',  joined:'2024-09-10' },
  { id:'H002', name:'Mehta Constructions', type:'Business', city:'Ahmedabad',mobile:'+91 82345 67890', email:'info@mehta.com',    jobs:48, status:'active',  joined:'2024-08-05' },
  { id:'H003', name:'Ravi Sharma',     type:'Regular',   city:'Delhi',     mobile:'+91 73456 78901', email:'ravi@gmail.com',    jobs:2,  status:'active',  joined:'2024-10-15' },
  { id:'H004', name:'ABC Logistics',   type:'Business',  city:'Mumbai',    mobile:'+91 64567 89012', email:'hr@abclogistics.in',jobs:120,status:'active',  joined:'2024-07-20' },
  { id:'H005', name:'Sunita Verma',    type:'Regular',   city:'Pune',      mobile:'+91 55678 90123', email:'sunita@gmail.com',  jobs:1,  status:'suspended',joined:'2024-11-01' },
];

export const JOB_POSTS = [
  { id:'J001', title:'Need 2 Masons for renovation',  postedBy:'Anita Shah',    type:'Regular',  city:'Surat',     skill:'Mason',      salary:'₹600-800/day', days:5,  applied:8,  status:'open',   date:'2024-11-10' },
  { id:'J002', title:'Factory helpers required (20)', postedBy:'Mehta Constructions', type:'Business',city:'Ahmedabad',skill:'Helper',  salary:'₹450-550/day', days:90, applied:34, status:'open',   date:'2024-11-09' },
  { id:'J003', title:'Electrician for office wiring', postedBy:'Ravi Sharma',   type:'Regular',  city:'Delhi',     skill:'Electrician',salary:'₹800-1000/day',days:3,  applied:5,  status:'filled', date:'2024-11-08' },
  { id:'J004', title:'Warehouse loaders needed (50)', postedBy:'ABC Logistics', type:'Business', city:'Mumbai',    skill:'Loader',     salary:'₹400-500/day', days:180,applied:67, status:'open',   date:'2024-11-07' },
  { id:'J005', title:'House shifting help needed',    postedBy:'Sunita Verma',  type:'Regular',  city:'Pune',      skill:'Helper',     salary:'₹500/day',     days:1,  applied:12, status:'closed', date:'2024-11-06' },
  { id:'J006', title:'Cook needed for 1 week',        postedBy:'Anita Shah',    type:'Regular',  city:'Surat',     skill:'Cook',       salary:'₹700/day',     days:7,  applied:4,  status:'open',   date:'2024-11-11' },
  { id:'J007', title:'Welders for manufacturing plant',postedBy:'ABC Logistics',type:'Business', city:'Mumbai',    skill:'Welder',     salary:'₹900-1100/day',days:60, applied:22, status:'open',   date:'2024-11-11' },
];

export const REPORTS = [
  { id:'R001', reportedBy:'Ramesh Kumar (Worker)',  reportedAgainst:'Anita Shah (Hirer)',       reason:'Payment not made after 3 days of work', category:'Payment Issue',   status:'pending',  date:'2024-11-10', priority:'high'   },
  { id:'R002', reportedBy:'Mehta Constructions (Business)', reportedAgainst:'Suresh Patel (Worker)', reason:'Worker did not show up after confirmation', category:'No Show',   status:'pending',  date:'2024-11-11', priority:'medium' },
  { id:'R003', reportedBy:'Priya Kumari (Worker)', reportedAgainst:'Ravi Sharma (Hirer)',       reason:'Unsafe work environment and harassment',category:'Safety Issue',    status:'resolved', date:'2024-11-08', priority:'high'   },
  { id:'R004', reportedBy:'Ajay Singh (Worker)',   reportedAgainst:'ABC Logistics (Business)', reason:'Less salary paid than what was agreed',  category:'Payment Issue',   status:'pending',  date:'2024-11-09', priority:'medium' },
  { id:'R005', reportedBy:'Sunita Verma (Hirer)',  reportedAgainst:'Deepak Yadav (Worker)',     reason:'Work quality was very poor',             category:'Work Quality',    status:'action',   date:'2024-11-07', priority:'low'    },
  { id:'R006', reportedBy:'Kavita Devi (Worker)',  reportedAgainst:'Ravi Sharma (Hirer)',       reason:'Abusive behavior during work',           category:'Misconduct',      status:'resolved', date:'2024-11-06', priority:'high'   },
];

export const SKILLS = [
  { id:'S001', name:'Mason / राजमिस्त्री',      workers:4820, active:true  },
  { id:'S002', name:'Electrician / इलेक्ट्रीशियन',workers:3210, active:true  },
  { id:'S003', name:'Plumber / प्लंबर',         workers:2890, active:true  },
  { id:'S004', name:'Carpenter / बढ़ई',         workers:2540, active:true  },
  { id:'S005', name:'Painter / पेंटर',          workers:2100, active:true  },
  { id:'S006', name:'Welder / वेल्डर',          workers:1980, active:true  },
  { id:'S007', name:'Driver / ड्राइवर',         workers:3400, active:true  },
  { id:'S008', name:'Helper / हेल्पर',          workers:6200, active:true  },
  { id:'S009', name:'Cook / रसोइया',            workers:1540, active:true  },
  { id:'S010', name:'Security Guard',           workers:1200, active:true  },
  { id:'S011', name:'Housekeeping',             workers:1890, active:false },
  { id:'S012', name:'AC Technician',            workers:890,  active:true  },
  { id:'S013', name:'Forklift Operator',        workers:430,  active:true  },
  { id:'S014', name:'ITI Technician',           workers:760,  active:true  },
  { id:'S015', name:'Gardener / माली',          workers:540,  active:false },
];

export const ANNOUNCEMENTS_SENT = [
  { id:'A001', title:'Platform Maintenance on Nov 15', message:'The platform will be under maintenance from 2AM to 4AM on November 15.', sentTo:'Everyone', date:'2024-11-10', status:'sent' },
  { id:'A002', title:'New Feature: Work Photos',       message:'Workers can now upload photos of their work to their profile.',          sentTo:'Workers',   date:'2024-11-05', status:'sent' },
  { id:'A003', title:'Diwali Bonus Jobs Posted',       message:'Many bonus-paying jobs have been posted for the Diwali season.',        sentTo:'Workers',   date:'2024-10-28', status:'sent' },
];
