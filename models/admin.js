const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const ADMINS_FILE = path.join(__dirname, "../data/admins.json");

class Admin {
  static async inicializar() {
    try {
      await fs.access(ADMINS_FILE);
      const data = await fs.readFile(ADMINS_FILE, "utf8");
      const admins = JSON.parse(data);

      if (admins.length === 0) {
        console.log(
          "Nenhum administrador encontrado. Criando administrador padrão..."
        );
        const adminPadrao = await this.criarAdminPadrao();
        await fs.writeFile(ADMINS_FILE, JSON.stringify([adminPadrao], null, 2));
        console.log("Administrador padrão criado com sucesso.");
      }
    } catch {
      console.log(
        "Arquivo de administradores não encontrado. Criando um novo..."
      );
      const adminPadrao = await this.criarAdminPadrao();
      await fs.writeFile(ADMINS_FILE, JSON.stringify([adminPadrao], null, 2));
      console.log("Administrador padrão criado com sucesso.");
    }
  }

  static async criarAdminPadrao() {
    const bcrypt = require("bcryptjs");
    const senhaCriptografada = await bcrypt.hash("admin123", 10);
    return {
      id: uuidv4(),
      nome: "admin",
      email: "admin@gmail.com",
      senha: senhaCriptografada,
      papel: "admin",
      criadoEm: new Date().toISOString(),
    };
  }

  static async buscarTodos() {
    try {
      const data = await fs.readFile(ADMINS_FILE, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Erro ao buscar administradores:", error);
      return [];
    }
  }

  static async criar({ nome, email, senha }) {
    const admins = await this.buscarTodos();
    const bcrypt = require("bcryptjs");

    if (admins.some((admin) => admin.email === email)) {
      throw new Error("E-mail já cadastrado");
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoAdmin = {
      id: uuidv4(),
      nome,
      email,
      senha: senhaCriptografada,
      papel: "admin",
      criadoEm: new Date().toISOString(),
    };

    admins.push(novoAdmin);
    await fs.writeFile(ADMINS_FILE, JSON.stringify(admins, null, 2));

    const { senha: _, ...adminSemSenha } = novoAdmin;
    return adminSemSenha;
  }

  static async buscarPorEmail(email) {
    const admins = await this.buscarTodos();

    if (!Array.isArray(admins)) {
      throw new Error(
        "Formato inválido de dados no arquivo de administradores."
      );
    }

    return admins.find((admin) => admin.email === email);
  }

  static async buscarPorId(id) {
    const admins = await this.buscarTodos();
    return admins.find((admin) => admin.id === id);
  }
}

Admin.inicializar();

module.exports = Admin;
