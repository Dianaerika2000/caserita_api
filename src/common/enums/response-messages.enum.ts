export enum ResponseMessages {
  // ─── Genéricos ────────────────────────────────────────────────
  OK = 'Operación exitosa',
  CREATED = 'Recurso creado correctamente',
  UPDATED = 'Recurso actualizado correctamente',
  DELETED = 'Recurso eliminado correctamente',
  NOT_FOUND = 'Recurso no encontrado',

  // ─── Categorías ───────────────────────────────────────────────
  CATEGORY_CREATED = 'Categoría creada correctamente',
  CATEGORY_UPDATED = 'Categoría actualizada correctamente',
  CATEGORY_DELETED = 'Categoría eliminada correctamente',
  CATEGORY_FOUND = 'Categoría obtenida correctamente',
  CATEGORIES_FOUND = 'Categorías obtenidas correctamente',
  CATEGORY_NOT_FOUND = 'Categoría no encontrada',

  // ─── Auth ─────────────────────────────────────────────────────
  LOGIN_SUCCESS = 'Inicio de sesión exitoso',
  LOGOUT_SUCCESS = 'Sesión cerrada correctamente',
  UNAUTHORIZED = 'No autorizado',
  FORBIDDEN = 'No tienes permisos para realizar esta acción',

  // ─── Usuarios ─────────────────────────────────────────────────
  USER_CREATED = 'Usuario creado correctamente',
  USER_UPDATED = 'Usuario actualizado correctamente',
  USER_DELETED = 'Usuario eliminado correctamente',
  USER_FOUND = 'Usuario obtenido correctamente',
  USERS_FOUND = 'Usuarios obtenidos correctamente',
  USER_NOT_FOUND = 'Usuario no encontrado',
}
