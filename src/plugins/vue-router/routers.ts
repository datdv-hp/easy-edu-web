import authRouters from '../../features/auth/routers';
import teacherRouters from '@/features/teacher/routers';
import studentRoutes from '@/features/student/routers';
import managerRoutes from '@/features/manager/routers';
import coursesRoutes from '@/features/courses/routers';
import subjectRoutes from '@/features/subject/routers';
import classroomRoutes from '@/features/classroom/routers';
import lessonRoutes from '@/features/lesson/routers';
import scheduleTrackingRoutes from '@/features/schedule-tracking/routers';
import syllabusRoutes from '@/features/syllabus/routers';
import settingRoutes from '@/features/setting/routers';
// import dashboardRouters from '@/features/dashboard/routers';

export const routers = [
  ...authRouters,
  // ...dashboardRouters,
  ...teacherRouters,
  ...studentRoutes,
  ...managerRoutes,
  ...coursesRoutes,
  ...subjectRoutes,
  ...classroomRoutes,
  ...lessonRoutes,
  ...scheduleTrackingRoutes,
  ...syllabusRoutes,
  ...settingRoutes,
];
