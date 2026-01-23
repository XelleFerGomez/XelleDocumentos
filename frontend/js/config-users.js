// frontend/js/config-users.js

window.SeedData = window.SeedData || {};

window.SeedData.users = [
    // TU USUARIO PRINCIPAL
    {
        id: 1,
        username: "Xelle_Fer",    // <--- Aquí está tu usuario restaurado
        password: "123",          // <--- Contraseña temporal (cámbiala si gustas)
        fullName: "Luis Fernando Gómez",
        role: "super_admin",      // Acceso total
        moduleAccess: ["all"]
    },
    // Usuarios de prueba para otros roles
    {
        id: 2,
        username: "calidad",
        password: "123",
        fullName: "Gerente de Calidad",
        role: "quality_manager",
        moduleAccess: ["lab-calidad", "documentacion"]
    },
    {
        id: 3,
        username: "ventas",
        password: "123",
        fullName: "Ejecutivo Comercial",
        role: "sales",
        moduleAccess: ["comercial"]
    }
];