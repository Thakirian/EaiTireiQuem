const fs = require("fs").promises;
const path = require("path");

const ARQUIVO_GRUPOS = path.join(__dirname, "../data/grupos.json");

class Grupo {
  static async inicializar() {
    try {
      await fs.access(ARQUIVO_GRUPOS);
    } catch {
      await fs.writeFile(
        ARQUIVO_GRUPOS,
        JSON.stringify({ counter: 0, grupos: [] })
      );
    }
  }

  static async buscarTodos() {
    const data = await fs.readFile(ARQUIVO_GRUPOS, "utf8");
    const { grupos } = JSON.parse(data);
    return grupos || [];
  }

  static async salvarTodos({ counter, grupos }) {
    await fs.writeFile(
      ARQUIVO_GRUPOS,
      JSON.stringify({ counter, grupos }, null, 2)
    );
  }

  static async criar({ nome, idAdmin }) {
    const data = await fs.readFile(ARQUIVO_GRUPOS, "utf8");
    const { counter, grupos } = JSON.parse(data);

    const novoGrupo = {
      id: counter,
      nome,
      idAdmin,
      participantes: [idAdmin],
      status: "aberto",
      dataCriacao: new Date().toISOString(),
      resultadoSorteio: null,
      dataSorteio: null,
    };

    grupos.push(novoGrupo);

    await this.salvarTodos({ counter: counter + 1, grupos });
    return novoGrupo;
  }

  static async adicionarParticipante(idGrupo, idUsuario) {
    const data = await fs.readFile(ARQUIVO_GRUPOS, "utf8");
    const { counter, grupos } = JSON.parse(data);

    idGrupo = Number(idGrupo);
    idUsuario = Number(idUsuario);

    console.log("ID do Grupo:", idGrupo); 
    console.log("ID do Usuário:", idUsuario);

    const grupo = grupos.find((g) => g.id === idGrupo);

    if (!grupo) {
      console.error("Grupo não encontrado: ", idGrupo);
      throw new Error("Grupo não encontrado.");
    }

    if (grupo.status !== "aberto")
      throw new Error("Grupo não está aberto para novos participantes.");

    grupo.participantes = grupo.participantes.filter((part) => part !== null);

    if (grupo.participantes.includes(idUsuario))
      throw new Error("Usuário já está no grupo.");

    grupo.participantes.push(idUsuario);

    await this.salvarTodos({ counter, grupos });
    return grupo;
  }

  static async buscarPorId(id) {
    id = Number(id);
    const data = await fs.readFile(ARQUIVO_GRUPOS, "utf8");
    const { grupos } = JSON.parse(data);
    return grupos.find((g) => g.id === id);
  }

  static async excluir(id) {
    const data = await fs.readFile(ARQUIVO_GRUPOS, "utf8");
    const { counter, grupos } = JSON.parse(data);

    const gruposFiltrados = grupos.filter((g) => g.id !== id);

    await this.salvarTodos({ counter, grupos: gruposFiltrados });
  }

  static async realizarSorteio(idGrupo) {
    const data = await fs.readFile(ARQUIVO_GRUPOS, "utf8");
    const { counter, grupos } = JSON.parse(data);

    const grupo = grupos.find((g) => g.id === idGrupo);
    if (!grupo) {
      throw new Error("Grupo não encontrado.");
    }

    if (grupo.status === "finalizado") {
      throw new Error("O sorteio já foi realizado.");
    }

    const participantes = grupo.participantes.slice(); 
    const resultados = {};

    for (let i = participantes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participantes[i], participantes[j]] = [
        participantes[j],
        participantes[i],
      ];
    }

    for (let i = 0; i < grupo.participantes.length; i++) {
      resultados[grupo.participantes[i]] =
        participantes[(i + 1) % grupo.participantes.length];
    }

    grupo.resultadoSorteio = resultados;
    grupo.dataSorteio = new Date().toISOString();
    grupo.status = "finalizado";

    await this.salvarTodos({ counter, grupos });

    return grupo;
  }
}

Grupo.inicializar();

module.exports = Grupo;
