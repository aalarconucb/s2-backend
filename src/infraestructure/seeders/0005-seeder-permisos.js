'use strict';

const {
  setTimestampsSeeder
} = require('../lib/util');

// Datos de producción
let items = [
  { id: '7f5b3565-b270-4c16-b957-1b1ac3aaa04d', tipo: 'SISTEMA', nombre: 'usuarios:crear', descripcion: 'Permiso para crear usuarios por entidad', estado: 'ACTIVO' },
  { id: 'e73a95a7-7eb6-4b73-bea1-8bd551e71093', tipo: 'SISTEMA', nombre: 'usuarios:listar', descripcion: 'Permiso para leer usuarios por entidad', estado: 'ACTIVO' },
  { id: '0fba0566-6db3-4e65-984d-e42a945a12d2', tipo: 'SISTEMA', nombre: 'usuarios:actualizar', descripcion: 'Permiso para actualizar usuarios por entidad', estado: 'ACTIVO' },
  { id: '0c1289e5-1870-4135-8217-0e2ec2b75e81', tipo: 'SISTEMA', nombre: 'usuarios:eliminar', descripcion: 'Permiso para eliminar usuarios por entidad', estado: 'ACTIVO' },
  { id: '6e3f26a6-e681-4304-8fcb-2e0b6b269ce7', tipo: 'SISTEMA', nombre: 'menus:listar', descripcion: 'Permiso para listar menus', estado: 'ACTIVO' },
  { id: 'f1d548ae-7a9d-4159-aace-48a00b997299', tipo: 'SISTEMA', nombre: 'menus:crear', descripcion: 'Permiso para crear menus', estado: 'ACTIVO' },
  { id: '8b83d19d-563c-43a8-b073-131d0256ee9f', tipo: 'SISTEMA', nombre: 'menus:actualizar', descripcion: 'Permiso para actualizar menus', estado: 'ACTIVO' },
  { id: '6dbe5edc-7075-4554-8f8f-ec33081c8fe8', tipo: 'SISTEMA', nombre: 'menus:eliminar', descripcion: 'Permiso para eliminar menus', estado: 'ACTIVO' },
  { id: '86f561eb-4c3c-445d-a460-bd7646323b3d', tipo: 'SISTEMA', nombre: 'roles:listar', descripcion: 'Permiso para listar roles', estado: 'ACTIVO' },
  { id: '0a0d00d4-5deb-4fd9-b8bd-02f526f1a3eb', tipo: 'SISTEMA', nombre: 'roles:crear', descripcion: 'Permiso para crear roles', estado: 'ACTIVO' },
  { id: '76d904bd-ee07-4732-b5df-0d9bd9efb744', tipo: 'SISTEMA', nombre: 'roles:actualizar', descripcion: 'Permiso para actualizar roles', estado: 'ACTIVO' },
  { id: '0afc4b37-1594-44e1-98d7-c9f47dd2672c', tipo: 'SISTEMA', nombre: 'roles:eliminar', descripcion: 'Permiso para eliminar roles', estado: 'ACTIVO' },
  { id: 'bcfed14e-2405-4e25-ac63-61e348e1c2c0', tipo: 'SISTEMA', nombre: 'permisos:listar', descripcion: 'Permiso para listar permisos', estado: 'ACTIVO' },
  { id: '15ff0e86-45f5-4b84-88ff-77461bccf7bc', tipo: 'SISTEMA', nombre: 'permisos:crear', descripcion: 'Permiso para crear permisos', estado: 'ACTIVO' },
  { id: '9b764e5c-7f65-4cfc-9741-b84d47ebfeb3', tipo: 'SISTEMA', nombre: 'permisos:actualizar', descripcion: 'Permiso para actualizar permisos', estado: 'ACTIVO' },
  { id: 'fb2aca8a-6257-4ef1-a435-5ed131d702f9', tipo: 'SISTEMA', nombre: 'permisos:eliminar', descripcion: 'Permiso para eliminar permisos', estado: 'ACTIVO' },
  { id: '22067709-ce42-4926-89e6-8ce2dc52e193', tipo: 'SISTEMA', nombre: 'entidades:listar', descripcion: 'Permiso para listar entidades', estado: 'ACTIVO' },
  { id: '5a064635-3084-42c5-ab38-d74588932b3c', tipo: 'SISTEMA', nombre: 'entidades:listarpor', descripcion: 'Permiso para listar entidad por id', estado: 'ACTIVO' },
  { id: 'a6aec23e-bdbf-4cf7-a97e-fceb3a0c782d', tipo: 'SISTEMA', nombre: 'entidades:crear', descripcion: 'Permiso para crear entidade', estado: 'ACTIVO' },
  { id: '56c2756b-63c4-4c1f-bf1d-d3b5c604eca6', tipo: 'SISTEMA', nombre: 'entidades:actualizar', descripcion: 'Permiso para actualizar entidade', estado: 'ACTIVO' },
  { id: '3ee48c68-fb87-4a22-a4cc-47ce4b2bc6c6', tipo: 'SISTEMA', nombre: 'entidades:eliminar', descripcion: 'Permiso para eliminar entidade', estado: 'ACTIVO' },
  { id: '743d712b-4904-489f-92ee-6ae6e9f6b1d7', tipo: 'SISTEMA', nombre: 'formulario:listar', descripcion: 'Permiso para listar formularios', estado: 'ACTIVO' },
  { id: 'b0b7e8be-0a7a-4ef9-bf16-bc9f1a687867', tipo: 'SISTEMA', nombre: 'formulario:listarpor', descripcion: 'Permiso para listar formulario por id', estado: 'ACTIVO' },
  { id: '959800a3-b744-4ffe-99e6-afaf33eb3ad3', tipo: 'SISTEMA', nombre: 'formulario:crear', descripcion: 'Permiso para crear formulario', estado: 'ACTIVO' },
  { id: '4cef1f8f-0672-46eb-aaf9-1bf6bb19af4b', tipo: 'SISTEMA', nombre: 'formulario:actualizar', descripcion: 'Permiso para actualizar formulario', estado: 'ACTIVO' },
  { id: 'cd2e8e5a-11b1-4f38-ae5c-b0858e6461ec', tipo: 'SISTEMA', nombre: 'formulario:eliminar', descripcion: 'Permiso para eliminar formulario', estado: 'ACTIVO' },
  { id: '4c6baaa4-2bb4-42ca-a487-ddf2da1b052a', tipo: 'SISTEMA', nombre: 'componente:listar', descripcion: 'Permiso para listar componentes', estado: 'ACTIVO' },
  { id: 'c7e71c1d-aae4-4384-9b12-c5312a1bf32d', tipo: 'SISTEMA', nombre: 'componente:listarpor', descripcion: 'Permiso para listar componente por id', estado: 'ACTIVO' },
  { id: 'cb921d03-a8ed-46d1-8cfa-7f881bba0c17', tipo: 'SISTEMA', nombre: 'componente:crear', descripcion: 'Permiso para crear componente', estado: 'ACTIVO' },
  { id: '69467c92-06e4-4cb5-8e81-a8d7fb9faab8', tipo: 'SISTEMA', nombre: 'componente:actualizar', descripcion: 'Permiso para actualizar componente', estado: 'ACTIVO' },
  { id: '62fff69d-a5a7-46a9-928f-8db80fb2ff53', tipo: 'SISTEMA', nombre: 'componente:eliminar', descripcion: 'Permiso para eliminar componente', estado: 'ACTIVO' },
  { id: '3e34c6f6-aa48-4a6c-96bb-1aafe36b8cd5', tipo: 'SISTEMA', nombre: 'cite:listar', descripcion: 'Permiso para listar cites', estado: 'ACTIVO' },
  { id: 'f472add0-d591-4179-b679-44ca29113d34', tipo: 'SISTEMA', nombre: 'cite:listarpor', descripcion: 'Permiso para listar cite por id', estado: 'ACTIVO' },
  { id: 'c43768b3-54a2-45f7-a6ef-9d5c0f90d5d4', tipo: 'SISTEMA', nombre: 'cite:crear', descripcion: 'Permiso para crear cite', estado: 'ACTIVO' },
  { id: '62717df2-3571-46c6-9e36-9badbea75188', tipo: 'SISTEMA', nombre: 'cite:actualizar', descripcion: 'Permiso para actualizar cite', estado: 'ACTIVO' },
  { id: '0337dc06-7b23-4768-b7f6-804ed67044d2', tipo: 'SISTEMA', nombre: 'cite:eliminar', descripcion: 'Permiso para eliminar cite', estado: 'ACTIVO' },
  { id: 'a66c6b73-99aa-424d-902c-9d5d73cbd017', tipo: 'SISTEMA', nombre: 'cite:generacite', descripcion: 'Genera cite por Entidad', estado: 'ACTIVO' },
  { id: '844cc0bc-60c7-494e-b61f-4a41baffe4bb', tipo: 'SISTEMA', nombre: 'entidadcomponente:listar', descripcion: 'Permiso para listar entidadcomponentes', estado: 'ACTIVO' },
  { id: '2bea0d0c-d12b-4c31-aed0-ec25598e07eb', tipo: 'SISTEMA', nombre: 'entidadcomponente:listarpor', descripcion: 'Permiso para listar entidadcomponente por id', estado: 'ACTIVO' },
  { id: '1a55dd8e-0091-4753-b626-e82822166b1a', tipo: 'SISTEMA', nombre: 'entidadcomponente:crear', descripcion: 'Permiso para crear entidadcomponente', estado: 'ACTIVO' },
  { id: 'c664b237-84bd-43fb-8648-f4942d09b109', tipo: 'SISTEMA', nombre: 'entidadcomponente:actualizar', descripcion: 'Permiso para actualizar entidadcomponente', estado: 'ACTIVO' },
  { id: '2ee56b9e-2bba-4d37-892c-10aaf654a073', tipo: 'SISTEMA', nombre: 'entidadcomponente:eliminar', descripcion: 'Permiso para eliminar entidadcomponente', estado: 'ACTIVO' },
  { id: 'db99f98d-9c86-4795-880c-7971955a11d2', tipo: 'SISTEMA', nombre: 'persona:personasegip', descripcion: 'Permiso para listar persona por CI', estado: 'ACTIVO' },
  { id: '48523625-91c4-40a3-9c3d-fa2575977c9b', tipo: 'SISTEMA', nombre: 'formulariodatos:listar', descripcion: 'Permiso para listar formulariodatos por CI', estado: 'ACTIVO' },
  { id: 'bdd2ef70-1d02-452e-b67e-1c40814f48c5', tipo: 'SISTEMA', nombre: 'formulariodatos:listarpor', descripcion: 'Permiso para listar formulariodatos por id', estado: 'ACTIVO' },
  { id: '8a313739-f2fc-442d-b982-a5219d333892', tipo: 'SISTEMA', nombre: 'formulariodatos:crear', descripcion: 'Permiso para crear formulariodatos', estado: 'ACTIVO' },
  { id: '43f0796f-342a-4ce1-a8ff-50b6788b6055', tipo: 'SISTEMA', nombre: 'formulariodatos:actualizar', descripcion: 'Permiso para actualizar formulariodatos', estado: 'ACTIVO' },
  { id: '3690bed7-799c-41bc-a688-03022ad7f7ce', tipo: 'SISTEMA', nombre: 'formulariodatos:eliminar', descripcion: 'Permiso para eliminar formulariodatos', estado: 'ACTIVO' },
  { id: 'af15eb25-e052-486b-a967-660d61ecf0d1', tipo: 'SISTEMA', nombre: 'aplicaciones:listar', descripcion: 'Permiso para listar aplicacioness', estado: 'ACTIVO' },
  { id: '4cc343eb-0782-4739-8509-db79be8e416e', tipo: 'SISTEMA', nombre: 'aplicaciones:listarpor', descripcion: 'Permiso para listar aplicaciones por id', estado: 'ACTIVO' },
  { id: 'c5720a83-15c4-4641-8164-a0a4da7c3d8e', tipo: 'SISTEMA', nombre: 'aplicaciones:crear', descripcion: 'Permiso para crear aplicaciones', estado: 'ACTIVO' },
  { id: 'dcf487a4-7639-4073-b4f4-dff8530ff284', tipo: 'SISTEMA', nombre: 'aplicaciones:actualizar', descripcion: 'Permiso para actualizar aplicaciones', estado: 'ACTIVO' },
  { id: '66ffb4c4-bec3-4ad0-a1b3-f3bea8fe62da', tipo: 'SISTEMA', nombre: 'aplicaciones:eliminar', descripcion: 'Permiso para eliminar aplicaciones', estado: 'ACTIVO' },

  { id: '66ffb4c4-bec3-4ad0-a1b3-f3bea8fe6201', tipo: 'INTEROPERABILIDAD', nombre: 'usuarios:listar', descripcion: 'Permiso para Listar usuarios de forma externa', estado: 'ACTIVO' },
  { id: '66ffb4c4-bec3-4ad0-a1b3-f3bea8fe6202', tipo: 'INTEROPERABILIDAD', nombre: 'usuarios:crear', descripcion: 'Permiso para crear un usuario', estado: 'ACTIVO' },
  { id: '66ffb4c4-bec3-4ad0-a1b3-f3bea8fe6203', tipo: 'INTEROPERABILIDAD', nombre: 'usuarios:actualizar', descripcion: 'Permiso para eliminar actualizar un usuario', estado: 'ACTIVO' },
  { id: '66ffb4c4-bec3-4ad0-a1b3-f3bea8fe6204', tipo: 'INTEROPERABILIDAD', nombre: 'usuarios:eliminar', descripcion: 'Permiso para eliminar un usuario', estado: 'ACTIVO' },
  { id: '66ffb4c4-bec3-4ad0-a1b3-f3bea8fe6205', tipo: 'INTEROPERABILIDAD', nombre: 'usuarios:cambiarEstado', descripcion: 'Permiso para cambiar el estado de un usuario.', estado: 'ACTIVO' }
];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_permiso', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },

  down (queryInterface, Sequelize) {}
};
