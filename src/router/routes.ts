import type { RouteRecordRaw } from 'vue-router'
import type { Role } from '@/types'

// Extend vue-router meta to include roles
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    roles?: Role[]
    requiresAuth?: boolean
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/HomeView.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/courses',
    name: 'CourseList',
    component: () => import('@/views/course/CourseListView.vue'),
    meta: { title: '课程列表', requiresAuth: true },
  },
  {
    path: '/courses/:id',
    name: 'CourseDetail',
    component: () => import('@/views/course/CourseDetailView.vue'),
    meta: { title: '课程学习', requiresAuth: true },
  },
  {
    path: '/courses/:id/manage',
    name: 'CourseManage',
    component: () => import('@/views/course/CourseManageView.vue'),
    meta: { title: '课程管理', requiresAuth: true, roles: ['admin', 'teacher', 'assistant'] },
  },
  {
    path: '/courses/:id/discussion',
    name: 'CourseDiscussion',
    component: () => import('@/views/discussion/DiscussionView.vue'),
    meta: { title: '课程讨论', requiresAuth: true },
  },
  // Admin routes
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { title: '管理后台', requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: () => import('@/views/admin/UserManagement.vue'),
    meta: { title: '用户管理', requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/teachers/approval',
    name: 'TeacherApproval',
    component: () => import('@/views/admin/TeacherApproval.vue'),
    meta: { title: '教师审批', requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/semester',
    name: 'SemesterConfig',
    component: () => import('@/views/admin/SemesterConfig.vue'),
    meta: { title: '学期配置', requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/roadmap',
    name: 'RoadmapManagement',
    component: () => import('@/views/admin/RoadmapManagement.vue'),
    meta: { title: 'Roadmap 管理', requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/settings',
    name: 'SystemSettings',
    component: () => import('@/views/admin/SystemSettings.vue'),
    meta: { title: '系统设置', requiresAuth: true, roles: ['admin'] },
  },
  // Teacher routes
  {
    path: '/teacher',
    name: 'TeacherDashboard',
    component: () => import('@/views/teacher/TeacherDashboard.vue'),
    meta: { title: '教师工作台', requiresAuth: true, roles: ['admin', 'teacher'] },
  },
  {
    path: '/teacher/create-course',
    name: 'CourseCreator',
    component: () => import('@/views/teacher/CourseCreator.vue'),
    meta: { title: '创建课程', requiresAuth: true, roles: ['admin', 'teacher'] },
  },
  {
    path: '/teacher/courses/:id/transfer',
    name: 'CourseTransfer',
    component: () => import('@/views/teacher/CourseTransfer.vue'),
    meta: { title: '课程所有权转移', requiresAuth: true, roles: ['admin', 'teacher'] },
  },
  {
    path: '/teacher/courses/:id/schedule',
    name: 'ScheduleManager',
    component: () => import('@/views/teacher/ScheduleManager.vue'),
    meta: { title: '课程排期', requiresAuth: true, roles: ['admin', 'teacher'] },
  },
  {
    path: '/teacher/question-bank',
    name: 'QuestionBank',
    component: () => import('@/views/teacher/QuestionBank.vue'),
    meta: { title: '题库管理', requiresAuth: true, roles: ['admin', 'teacher'] },
  },
  {
    path: '/teacher/students/:courseId',
    name: 'StudentData',
    component: () => import('@/views/teacher/StudentData.vue'),
    meta: { title: '学生数据', requiresAuth: true, roles: ['admin', 'teacher', 'assistant'] },
  },
  // Student routes
  {
    path: '/student',
    name: 'StudentDashboard',
    component: () => import('@/views/student/StudentDashboard.vue'),
    meta: { title: '学习中心', requiresAuth: true, roles: ['student'] },
  },
  {
    path: '/student/courses',
    name: 'MyCourses',
    component: () => import('@/views/student/MyCourses.vue'),
    meta: { title: '我的课程', requiresAuth: true, roles: ['student'] },
  },
  {
    path: '/student/progress',
    name: 'ProgressTracker',
    component: () => import('@/views/student/ProgressTracker.vue'),
    meta: { title: '学习进度', requiresAuth: true, roles: ['student'] },
  },
  {
    path: '/student/practice',
    name: 'PracticeCenter',
    component: () => import('@/views/student/PracticeCenter.vue'),
    meta: { title: '题库练习', requiresAuth: true, roles: ['student'] },
  },
  {
    path: '/student/error-book',
    name: 'ErrorBook',
    component: () => import('@/views/student/ErrorBook.vue'),
    meta: { title: '错题本', requiresAuth: true, roles: ['student'] },
  },
  // Profile
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/ProfileView.vue'),
    meta: { title: '个人设置', requiresAuth: true },
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '404' },
  },
]
