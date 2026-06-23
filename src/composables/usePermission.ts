import type { User, Course, Post, Reply } from '@/types'

/**
 * Centralized permission composable.
 * All permission logic lives here so templates and components
 * only call these functions, keeping role logic in one place.
 */
export function usePermission() {
  function getRole(user: User | null) {
    return user?.role ?? null
  }

  // ===== Course permissions =====

  function canCreateCourse(user: User | null): boolean {
    const role = getRole(user)
    return role === 'admin' || role === 'teacher'
  }

  function canEditCourse(user: User | null, course: Course | null): boolean {
    if (!user || !course) return false
    if (user.role === 'admin') return true
    if (user.role === 'teacher' && course.ownerId === user.id) return true
    if (user.role === 'assistant') return true
    return false
  }

  function canDeleteCourse(user: User | null, course: Course | null): boolean {
    if (!user || !course) return false
    return user.role === 'admin' || (user.role === 'teacher' && course.ownerId === user.id)
  }

  function canTransferCourse(user: User | null, course: Course | null): boolean {
    if (!user || !course) return false
    return user.role === 'admin' || (user.role === 'teacher' && course.ownerId === user.id)
  }

  // ===== Directory / Content permissions =====

  function canEditDirectory(user: User | null, course: Course | null): boolean {
    if (!user) return false
    if (user.role === 'admin') return true
    if (user.role === 'teacher' && course?.ownerId === user.id) return true
    if (user.role === 'assistant') return true
    return false
  }

  // ===== Discussion permissions =====

  function canManageDiscussion(user: User | null): boolean {
    const role = getRole(user)
    return role === 'admin' || role === 'teacher' || role === 'assistant'
  }

  function canDeletePost(user: User | null, post: Post | null): boolean {
    if (!user) return false
    const role = getRole(user)
    if (role === 'admin' || role === 'teacher' || role === 'assistant') return true
    if (post && post.authorId === user.id) return true
    return false
  }

  function canDeleteReply(user: User | null, reply: Reply | null): boolean {
    if (!user) return false
    const role = getRole(user)
    if (role === 'admin' || role === 'teacher' || role === 'assistant') return true
    if (reply && reply.authorId === user.id) return true
    return false
  }

  function canPinPost(user: User | null): boolean {
    const role = getRole(user)
    return role === 'admin' || role === 'teacher' || role === 'assistant'
  }

  function canMarkAnswer(user: User | null): boolean {
    const role = getRole(user)
    return role === 'admin' || role === 'teacher' || role === 'assistant'
  }

  // ===== Student data permissions =====

  function canViewStudentData(user: User | null): boolean {
    const role = getRole(user)
    return role === 'admin' || role === 'teacher' || role === 'assistant'
  }

  // ===== Admin permissions =====

  function canManageUsers(user: User | null): boolean {
    return getRole(user) === 'admin'
  }

  function canApproveTeachers(user: User | null): boolean {
    return getRole(user) === 'admin'
  }

  function canConfigureSemester(user: User | null): boolean {
    return getRole(user) === 'admin'
  }

  function canManageRoadmap(user: User | null): boolean {
    return getRole(user) === 'admin'
  }

  function canManageSystem(user: User | null): boolean {
    return getRole(user) === 'admin'
  }

  // ===== Student permissions =====

  function canEnroll(user: User | null): boolean {
    return getRole(user) === 'student'
  }

  function canTrackProgress(user: User | null): boolean {
    return getRole(user) === 'student'
  }

  function canUsePractice(user: User | null): boolean {
    return getRole(user) === 'student'
  }

  return {
    getRole,
    canCreateCourse,
    canEditCourse,
    canDeleteCourse,
    canTransferCourse,
    canEditDirectory,
    canManageDiscussion,
    canDeletePost,
    canDeleteReply,
    canPinPost,
    canMarkAnswer,
    canViewStudentData,
    canManageUsers,
    canApproveTeachers,
    canConfigureSemester,
    canManageRoadmap,
    canManageSystem,
    canEnroll,
    canTrackProgress,
    canUsePractice,
  }
}
