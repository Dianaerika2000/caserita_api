import dataSource from '../config/data-source';
import { seedCategories } from './seeders/category.seeder';

async function runSeeders(): Promise<void> {
  console.log('🚀 Iniciando seeders...');

  try {
    await dataSource.initialize();
    console.log('✅ Conexión a base de datos establecida');

    await seedCategories(dataSource);

    console.log('✅ Todos los seeders ejecutados correctamente');
  } catch (error) {
    console.error('❌ Error ejecutando seeders:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Conexión cerrada');
  }
}

void runSeeders();
