import express from "express";

const server = express();
const porta = 3000;

const contatos = []; 

const paginaContato = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fale Conosco</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    .form-text { color: red; }
    .contato-container {
        width: 100%;
        max-width: 800px;
        margin-top: 80px;
        padding: 2rem;
        background: white;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body class="bg-light">
  <div class="container d-flex justify-content-center">
    <div class="contato-container">
      <h2 class="text-center mb-4 fw-bold">FALE CONOSCO</h2>

      <form method="post" action="/enviar-contato">
        <div class="mb-3">
          <label for="nome" class="form-label fw-semibold">Nome completo</label>
          <input type="text" class="form-control" id="nome" name="nome" placeholder="Digite seu nome...">
          <div id="nomeMsg" class="form-text"></div>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label fw-semibold">Email</label>
          <input type="email" class="form-control" id="email" name="email" placeholder="Digite seu email...">
          <div id="emailMsg" class="form-text"></div>
        </div>

        <div class="mb-3">
          <label for="mensagem" class="form-label fw-semibold">Mensagem</label>
          <textarea class="form-control" id="mensagem" name="mensagem" rows="4" placeholder="Digite sua mensagem..."></textarea>
          <div id="mensagemMsg" class="form-text"></div>
        </div>

        <div class="d-grid gap-2 mt-4">
          <button type="submit" class="btn btn-primary">Enviar</button>
          <button type="button" class="btn btn-secondary" onclick="window.location.href='/pagina-listar'">Ver Contatos</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const form = document.querySelector("form");
      const nome = document.getElementById("nome");
      const email = document.getElementById("email");
      const mensagem = document.getElementById("mensagem");

      form.addEventListener("submit", (e) => {
        e.preventDefault();

        document.querySelectorAll(".form-text").forEach(el => el.textContent = "");

        if (!nome.value.trim()) {
          document.getElementById("nomeMsg").textContent = "Digite seu nome completo.";
          return;
        }

        if (!email.value.trim()) {
          document.getElementById("emailMsg").textContent = "Digite seu email.";
          return;
        }

        if (!mensagem.value.trim()) {
          document.getElementById("mensagemMsg").textContent = "Digite sua mensagem.";
          return;
        }

        e.target.submit();
      });
    });
  </script>
</body>
</html>
`;

function gerarPaginaListar() {
  let linhas = contatos.map((c, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${c.nome}</td>
      <td>${c.email}</td>
      <td>${c.mensagem}</td>
    </tr>
  `).join("");

  if (!linhas) {
    linhas = `
      <tr>
        <td colspan="4" class="text-center text-muted">Nenhum contato enviado ainda.</td>
      </tr>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lista de Contatos</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    .tabela-container {
        width: 100%;
        max-width: 1000px;
        margin-top: 60px;
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body class="bg-light">
  <div class="container d-flex justify-content-center">
    <div class="tabela-container">
      <h2 class="text-center mb-4 fw-bold">CONTATOS RECEBIDOS</h2>
      <div class="table-responsive">
        <table class="table table-striped table-bordered align-middle">
          <thead class="table-dark">
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Mensagem</th>
            </tr>
          </thead>
          <tbody>
            ${linhas}
          </tbody>
        </table>
      </div>
      <div class="d-grid mt-4">
        <button class="btn btn-secondary" onclick="window.location.href='/pagina-contato'">Voltar para Contato</button>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.get("/", (req, res) => res.redirect("/pagina-contato"));

server.get("/pagina-contato", (req, res) => {
  res.send(paginaContato);
});

server.post("/enviar-contato", (req, res) => {
  const { nome, email, mensagem } = req.body;
  contatos.push({ nome, email, mensagem });
  res.redirect("/pagina-listar");
});

server.get("/pagina-listar", (req, res) => {
  res.send(gerarPaginaListar());
});

server.listen(porta, () => { console.log("Rodando servidor na porta " + porta + "!!!" ) });