import { DataSource } from 'typeorm';
import { Category } from '../../modules/categories/entities/category.entity';

export async function seedCategories(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(Category);

  const existing = await repo.count();
  if (existing > 0) return; // no duplicar si ya existen

  const structure = [
    {
      name: 'Mujer',
      children: [
        'Accesorios',
        'Calzados',
        'Deportivo',
        'Pantalones',
        'Vestidos',
        'Faldas',
        'Ropa interior',
        'Shorts',
        'Blusas y Camisas',
        'Chamarras',
        'Ropa de invierno',
        'Conjunto',
      ],
    },
    {
      name: 'Hombre',
      children: [
        'Pantalones',
        'Deportivo',
        'Shorts',
        'Camisas y Poleras',
        'Chamarras',
        'Ropa de invierno',
        'Ropa interior',
        'Accesorios',
        'Calzados',
        'Conjunto',
      ],
    },
    {
      name: 'Niños',
      children: [
        'Bebés',
        'Shorts',
        'Pantalones',
        'Camisas, poleras, blusas',
        'Ropa de invierno',
        'Calzados',
        'Vestidos y faldas',
        'Ropa interior',
        'Accesorios',
        'Conjunto',
      ],
    },
  ];

  for (const parentData of structure) {
    const parent = repo.create({
      name: parentData.name,
      isActive: true,
      parentId: null,
    });
    const savedParent = await repo.save(parent);

    for (const childName of parentData.children) {
      const child = repo.create({
        name: childName,
        isActive: true,
        parentId: savedParent.id,
      });
      await repo.save(child);
    }
  }

  console.log('✅ Categorías iniciales creadas correctamente');
}
