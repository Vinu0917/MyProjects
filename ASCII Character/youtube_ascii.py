import cv2, os, time, threading

# Super detailed ASCII characters (light → dark)
ASCII_CHARS = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/*tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"

def resize_frame(image, new_width=180):
    h, w, _ = image.shape
    aspect_ratio = h / w
    new_height = int(aspect_ratio * new_width * 0.55)  # keep proportions
    return cv2.resize(image, (new_width, new_height))

def frame_to_ascii(frame, new_width=180):
    """Convert frame to colored ASCII using ANSI escape codes."""
    frame = resize_frame(frame, new_width)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    ascii_img = ""
    num_chars = len(ASCII_CHARS)

    for y in range(frame.shape[0]):
        for x in range(frame.shape[1]):
            pixel = gray[y, x]
            r, g, b = frame[y, x]
            char = ASCII_CHARS[pixel * (num_chars - 1) // 255]
            # ANSI escape for RGB foreground color
            ascii_img += f"\033[38;2;{r};{g};{b}m{char}\033[0m"
        ascii_img += "\n"

    return ascii_img

def play_video_audio(video_path):
    """Play video with system audio (runs in separate thread)."""
    os.system(f'start \"\" \"{video_path}\"')

def play_ascii_video(video_path, new_width=180):
    """Play ASCII video synchronized to original FPS."""
    audio_thread = threading.Thread(target=play_video_audio, args=(video_path,))
    audio_thread.start()

    cap = cv2.VideoCapture(video_path)
    video_fps = cap.get(cv2.CAP_PROP_FPS)
    if video_fps <= 0:
        video_fps = 30
    frame_time = 1 / video_fps

    start_time = time.time()
    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        expected_time = start_time + frame_count * frame_time
        ascii_img = frame_to_ascii(frame, new_width)
        os.system('cls' if os.name == 'nt' else 'clear')
        print(ascii_img)

        frame_count += 1
        sleep_time = expected_time + frame_time - time.time()
        if sleep_time > 0:
            time.sleep(sleep_time)

    cap.release()
    audio_thread.join()

# ---- MAIN ----
url = "https://youtu.be/KpaIAqFxF_w?si=Pb8jTwQjFx4mU5O_"  # <-- Change this to any YouTube link

# Create a unique filename for the video
import time as t
video_file = f"youtube_video_{int(t.time())}.mp4"

# Download the video (video + audio together)
os.system(f'yt-dlp -f best -o "{video_file}" {url}')

# Play the video in ASCII with synced audio
play_ascii_video(video_file, new_width=120)  # reduce width if too slow
