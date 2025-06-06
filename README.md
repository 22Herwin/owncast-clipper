# 🎬 Owncast Clipper

Owncast Clipper is a web-based Node.js application that lets users view a live HLS stream from an Owncast server, select a start time and duration, and generate downloadable video clips using FFmpeg — all through a clean browser interface.

---

## 🚀 Features

- ✅ Live video playback using HLS.js  
- ✂️ Clip the stream by setting start time and duration  
- ⚡ Generates `.mp4` clips server-side using FFmpeg  
- 📥 Auto-download the clip after generation  
- 🧩 Proxy stream support to handle CORS and secure streaming  

---

## 🧰 Requirements

Before using this project, ensure the following are installed:

- **Node.js** — [Download](https://nodejs.org/)  
- **FFmpeg** — [Download](https://ffmpeg.org/download.html)  
- **Owncast** — [Install guide](https://owncast.online/docs/)  
- (Optional) **Ngrok** — [Download](https://ngrok.com/)  

---

## 📁 Installation

### 1. Clone the repository

```bash
git clone https://github.com/22Herwin/owncast-clipper.git
cd owncast-clipper
```

### 2. Install dependencies

```bash
npm install
```

### 3. Confirm FFmpeg is installed and in your system PATH

```bash
ffmpeg -version
```

If the above command doesn't show FFmpeg info, install it or add it to PATH.

---

## ⚙️ Configuration

By default, the app proxies an Owncast server running at:

```
http://<localhost>:8080
```

To change this, edit `server.js`:

```js
target: 'http://<your-owncast-ip>:8080'
```

---

## 🏃 Running the App

### Option 1: Manual (development/testing)

```bash
node server.js
```

Then visit: [http://localhost:3001](http://localhost:3001)

---

### Option 2: With Owncast + Ngrok (auto-start)

Use the provided Bash script to launch everything:

```bash
chmod +x start_stream.sh
./start_stream.sh
```

This will:
- Start Owncast
- Start the Node.js clipper server
- Open an Ngrok tunnel to port 3001

---

## 🖥️ Usage Instructions

1. Visit the app at `http://localhost:3001` or Ngrok URL  
2. The video will stream from Owncast via `/proxy-hls`  
3. Enter:
   - **Start Time** (in seconds)  
   - **Duration** (in seconds)  
   - **Clip Name** (filename for download)  
4. Click **"Create Clip"**  
5. The clip will:
   - Be processed using FFmpeg  
   - Auto-download to your device  
   - Be stored in `public/clips/` folder  

---

## 🌐 Folder Structure

```
owncast-clipper/
├── public/
│   ├── clips/           # Saved clips
│   ├── index.html       # Frontend UI
│   ├── script.js        # Frontend logic
│   ├── style.css        # Styling
├── server.js            # Node.js backend with Express + FFmpeg
├── start_stream.sh      # Script to auto-run everything
├── package.json
├── .gitignore
├── start_stream.sh
└── README.md
```

---

## 📄 License

MIT License – Use freely, modify, and distribute.

---

## 👨‍💻 Author

Developed by **[Herwin Dermawan]**  
Feel free to fork, contribute, or suggest improvements!
