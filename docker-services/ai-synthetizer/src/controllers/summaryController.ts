import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import OpenAI from "openai";

const MARKDOWN_DIR = process.env.CONTAINER_MARKDOWN_FILES_FOLDER_PATH || 'markdown path didnt work';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'API key didnt work';

export const summarizeCategory = async (req: Request, res: Response) => {
    //print consts variables
    console.log("MARKDOWN_DIR:", MARKDOWN_DIR);
    console.log("OPENAI_API_KEY:", OPENAI_API_KEY);
    const category = req.params.category;
    const directoryPath = path.join(MARKDOWN_DIR, category);
    console.log("Directory path:", directoryPath);

    try {
        const openai = new OpenAI({
            organization: 'org-VPbdupabep7glg4meSF20Hji',
        });
        console.log("Reading directory:", directoryPath);
        const files = fs.readdirSync(directoryPath);
        if (files.length === 0) {
            console.log("No files found in the directory.");
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: 'Say this is a test!' }],
                temperature: 0.7
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                }
            });

            console.log("OpenAI response:", response.data);
            const openai = new OpenAI({
                organization: 'org-VPbdupabep7glg4meSF20Hji',
            });

            // Take the first file in the directory
            const firstFile = files[0];
            const filePath = path.join(directoryPath, firstFile);
            console.log("Reading file:", filePath);
            const content = fs.readFileSync(filePath, 'utf-8');
            console.log("File content:", content);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing the summary');
    }
};
