# 🎶 SynthSpells

**AI-powered playlist summoner** — ใช้คำอธิบายอารมณ์ของคุณ เพื่อค้นหาเพลย์ลิสต์จาก YouTube ผ่าน AI

## 🔗 Demo
https://synthspells.vercel.app/

## 🪄 What is SynthSpells?

SynthSpells เป็นเว็บแอปที่ให้คุณ “เสกเพลย์ลิสต์” ได้จากอารมณ์หรือสถานการณ์ เช่น

> *"อยากได้เพลงชิลล์ๆ เหมือนนั่งอยู่ในร้านกาแฟ"*  

ระบบจะ:
1. ใช้ **ChatGPT** แปลงคำอธิบายนี้ให้กลายเป็น **ชื่อเพลย์ลิสต์** ที่น่าจะมีอยู่บน YouTube (เช่น `lofi chill cafe playlist`)
2. ใช้ **YouTube API** ค้นหา playlist นั้นโดยตรง
3. แสดงรายการวิดีโอในเพลย์ลิสต์นั้นให้คุณเล่นได้ทันที

## 🧱 Tech Stack

- **Framework**: Next.js + TypeScript  
- **AI**: OpenAI ChatGPT  
- **Music API**: YouTube Data API
- **Hosting**: Vercel

## 🚀 Getting Started

```bash
git clone https://github.com/Patipat003/synthspells
cd synthspells
npm install
npm run dev
