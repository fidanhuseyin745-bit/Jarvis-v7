'use strict';

const { execSync } = require('child_process');
require('dotenv').config();

class Coder {

    async ask(prompt) {

        console.log('📡 AI isteği gönderiliyor...');

        const body = JSON.stringify({
            model: process.env.MODEL,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            stream: false
        });

        const cmd =
            `curl -s ${process.env.AI_URL} ` +
            `-H "Content-Type: application/json" ` +
            `-d '${body}'`;

        const output = execSync(cmd, {
            encoding: 'utf8',
            maxBuffer: 20 * 1024 * 1024
        });

        const json = JSON.parse(output);

        console.log('✅ AI cevabı alındı.');

        return json.choices[0].message.content;

    }

}

module.exports = Coder;
