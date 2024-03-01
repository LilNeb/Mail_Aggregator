"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeCategory = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Remplacez 'path_to_your_markdown_files' par le chemin d'accès au dossier contenant vos fichiers Markdown
const MARKDOWN_DIR = process.env.MARKDOWN_FILES_FOLDER_PATH || 'markdown path didnt work';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'API key didnt work';
const summarizeCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = req.params.category;
    const directoryPath = path_1.default.join(MARKDOWN_DIR, category);
    console.log("Directory path : ", directoryPath);
    fs_1.default.readdir(directoryPath, (err, files) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error(err);
            return res.status(500).send('Unable to read the directory');
        }
        const summariesPromises = files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const filePath = path_1.default.join(directoryPath, file);
            const content = fs_1.default.readFileSync(filePath, 'utf-8');
            try {
                const response = yield axios_1.default.post('https://api.openai.com/v4/completions', {
                    prompt: `Résumez ce texte :\n\n${content}`,
                    model: 'text-davinci-003', // Assurez-vous d'utiliser le dernier modèle disponible
                    temperature: 0.7,
                    max_tokens: 150,
                }, {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`, // Remplacez YOUR_OPENAI_API_KEY par votre clé d'API
                    },
                });
                return response.data.choices[0].text.trim();
            }
            catch (error) {
                console.error('Error calling OpenAI:', error);
                throw new Error('Failed to summarize the content');
            }
        }));
        try {
            const summaries = yield Promise.all(summariesPromises);
            res.json({ summaries });
        }
        catch (error) {
            res.status(500).send('Error processing summaries');
        }
    }));
});
exports.summarizeCategory = summarizeCategory;
