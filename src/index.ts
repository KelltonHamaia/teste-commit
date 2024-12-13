#!/usr/bin/env node
import { select, input, Separator } from "@inquirer/prompts";
import { exit } from "process";


const message = async () => {
    const { execa } = await import("execa");

    let status = await execa("git", ["status"]); 
    if (status.stdout.includes("no changes added to commit")) { 
        console.log("Nenhuma alteração para commitar.\nAdicione arquivos ao commit utilizando\n'git add <arquivo>'\n ou\n'git add .'");
        exit(0); 
    }

    const commitNature = await select({
        message: "Qual tipo de commit deseja fazer?",
        choices: [
            new Separator("\n= = = Tipos de commit = = =\n"),
            { name: "init: Commit inicial", value: ":tada: init" },
            { name: "feat: Uma nova funcionalidade",value: ":sparkles: feat",},
            { name: "fix: Correção de bugs", value: ":bug: fix" },
            { name: "build: adicionar dependência",value: ":heavy_plus_sign: build",},
            { name: "refactor: Refatoração de código",value: ":recycle: refactor",},
            { name: "chore: Tarefas de build", value: ":truck: chore" },
            { name: "docs: Documentação", value: ":books: docs" },
            { name: "test: Testes", value: ":test_tube: test" },
        ],
        loop: false,
    });

    const commitTitle = await input({
        message: "Digite o título do commit:\n",
        validate: (input) => {
            if (input.length <= 0) {
                console.log("Título do commit não pode ser vazio.");
                return false;
            }
            if (input.length > 50) {
                console.log(
                    "Título do commit deve ter no máximo 50 caracteres."
                );
                return false;
            }
            return true;
        },
    });

    const commitBody = await input({
        message: "Digite a mensagem do commit:\n",
        validate: (input) => {
            if (input.length <= 0) {
                console.log("Mensagem do commit não pode ser vazia");
                return false;
            }
            if (input.length > 80) {
                console.log(
                    "Mensagem do commit deve ter no máximo 80 caracteres."
                );
                return false;
            }
            return true;
        },
    });

    const confirmCommit = await select({
        message: "Deseja confirmar o commit?",
        choices: [
            { name: "✔️  Sim", value: true },
            { name: "❌ Não", value: false },
        ],
        loop: false,
    });

    const commitMessage = `${commitNature}: ${commitTitle}\n\n- ${commitBody}`;

    if (confirmCommit === false) {
        return exit(1);
    }

    try {
        let response = await execa("git", ["commit", "-m", commitMessage]);
        console.log(response.stdout);
    } catch (error) {
        console.log(error) 
        console.log("Erro ao executar o commit.");
        exit(1);
    }


    const updateRepo = await select({
        message: "Deseja enviar suas alterações para o resositório remoto?",
        choices: [
            { name: "🚀 Sim", value: true },
            { name: "💣 Não", value: false },
        ],
        loop: false,
    });

    try {
        if(updateRepo) {
            let response = await execa("git push");
            console.log(response);
        }
    } catch (error) {
        console.log(error) 
        console.log("Erro ao executar o push.");
        exit(1);
    }
};

message();
