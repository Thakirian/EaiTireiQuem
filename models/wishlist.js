const fs = require("fs").promises;
const path = require("path");

const ARQUIVO_LISTAS_DESEJO = path.join(__dirname, "../data/wishlists.json");

class ListaDesejo {
  static async inicializar() {
    try {
      await fs.access(ARQUIVO_LISTAS_DESEJO);
    } catch {
      await fs.writeFile(
        ARQUIVO_LISTAS_DESEJO,
        JSON.stringify({ counter: 0, listas: [] })
      );
    }
  }

  static async buscarTodas() {
    const dados = await fs.readFile(ARQUIVO_LISTAS_DESEJO, "utf8");
    const { listas } = JSON.parse(dados);
    return listas || [];
  }

  static async salvarTodas({ counter, listas }) {
    await fs.writeFile(
      ARQUIVO_LISTAS_DESEJO,
      JSON.stringify({ counter, listas }, null, 2)
    );
  }

  static async criar({ userId, items }) {
    const dados = await fs.readFile(ARQUIVO_LISTAS_DESEJO, "utf8");
    const { counter, listas } = JSON.parse(dados);

    const listaExistente = listas.find((l) => l.userId === userId);
    if (listaExistente) {
      throw new Error("Usuário já possui uma lista de desejos");
    }

    const novaLista = {
      id: counter,
      userId,
      items: items.map((item, index) => ({
        id: counter + 1 + index,
        ...item,
        criadoEm: new Date().toISOString(),
      })),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    listas.push(novaLista);
    await this.salvarTodas({ counter: counter + 1 + items.length, listas });
    return novaLista;
  }

  static async buscarPorUsuario(userId) {
    const listas = await this.buscarTodas();
    return listas.find((lista) => lista.userId === userId);
  }

  static async adicionarItem(userId, item) {
    const dados = await fs.readFile(ARQUIVO_LISTAS_DESEJO, "utf8");
    const { counter, listas } = JSON.parse(dados);

    const lista = listas.find((l) => l.userId === userId);
    if (!lista) {
      throw new Error("Lista de desejos não encontrada");
    }

    const novoItem = {
      id: counter,
      ...item,
      criadoEm: new Date().toISOString(),
    };

    lista.items.push(novoItem);
    lista.atualizadoEm = new Date().toISOString();

    await this.salvarTodas({ counter: counter + 1, listas });
    return novoItem;
  }

  static async removerItem(userId, itemId) {
    const dados = await fs.readFile(ARQUIVO_LISTAS_DESEJO, "utf8");
    const { counter, listas } = JSON.parse(dados);

    const lista = listas.find((l) => l.userId === userId);
    if (!lista) {
      throw new Error("Lista de desejos não encontrada");
    }

    const indiceItem = lista.items.findIndex((item) => item.id === itemId);
    if (indiceItem === -1) {
      throw new Error("Item não encontrado");
    }

    lista.items.splice(indiceItem, 1);
    lista.atualizadoEm = new Date().toISOString();

    await this.salvarTodas({ counter, listas });
  }

  static async atualizarItem(userId, itemId, atualizacoes) {
    const dados = await fs.readFile(ARQUIVO_LISTAS_DESEJO, "utf8");
    const { counter, listas } = JSON.parse(dados);

    const lista = listas.find((l) => l.userId === userId);
    if (!lista) {
      throw new Error("Lista de desejos não encontrada");
    }

    const item = lista.items.find((item) => item.id === itemId);
    if (!item) {
      throw new Error("Item não encontrado");
    }

    Object.assign(item, atualizacoes);
    lista.atualizadoEm = new Date().toISOString();

    await this.salvarTodas({ counter, listas });
    return item;
  }
}

ListaDesejo.inicializar();

module.exports = ListaDesejo;
