require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.json());
app.use(express.static("public"));

//Testa o Banco e abre na pagina home
app.get("/", async (req, res) => {
    try {
        const result = await sql`SELECT version()`;
        const { version } = result[0];
        res.render("pages/index"); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao conectar ao banco.");
    }
});

// Página de login
app.get("/login", (req, res) => {
    res.render("pages/login");
});

// Inicia o servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
