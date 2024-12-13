#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = require("@inquirer/prompts");
const process_1 = require("process");
const message = async () => {
    const { execa } = await import("execa");
    const commitNature = await (0, prompts_1.select)({
        message: "Qual tipo de commit deseja fazer?",
        choices: [
            new prompts_1.Separator("\n= = = Tipos de commit = = =\n"),
            { name: "init: Commit inicial", value: ":tada: init" },
            { name: "feat: Uma nova funcionalidade", value: ":sparkles: feat", },
            { name: "fix: Correção de bugs", value: ":bug: fix" },
            { name: "build: adicionar dependência", value: ":heavy_plus_sign: build", },
            { name: "refactor: Refatoração de código", value: ":recycle: refactor", },
            { name: "chore: Tarefas de build", value: ":truck: chore" },
            { name: "docs: Documentação", value: ":books: docs" },
            { name: "test: Testes", value: ":test_tube: test" },
        ],
        loop: false,
    });
    const commitTitle = await (0, prompts_1.input)({
        message: "Digite o título do commit:\n",
        validate: (input) => {
            if (input.length <= 0) {
                console.log("Título do commit não pode ser vazio.");
                return false;
            }
            if (input.length > 50) {
                console.log("Título do commit deve ter no máximo 50 caracteres.");
                return false;
            }
            return true;
        },
    });
    const commitBody = await (0, prompts_1.input)({
        message: "Digite a mensagem do commit:\n",
        validate: (input) => {
            if (input.length <= 0) {
                console.log("Mensagem do commit não pode ser vazia");
                return false;
            }
            if (input.length > 80) {
                console.log("Mensagem do commit deve ter no máximo 80 caracteres.");
                return false;
            }
            return true;
        },
    });
    const confirmCommit = await (0, prompts_1.select)({
        message: "Deseja confirmar o commit?",
        choices: [
            { name: "✔️  Sim", value: true },
            { name: "❌ Não", value: false },
        ],
        loop: false,
    });
    const commitMessage = `${commitNature}: ${commitTitle}\n\n- ${commitBody}`;
    if (confirmCommit === false) {
        return (0, process_1.exit)("Finalizando script sem commit.");
    }
    try {
        let response = await execa("git", ["commit", "-m", commitMessage]);
        console.log(response.stdout);
    }
    catch (error) {
        console.log("Erro ao executar o commit.");
        (0, process_1.exit)("Finalizando script sem commit.");
    }
};
message();
