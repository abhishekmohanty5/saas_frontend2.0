# Background Video Setup Instructions

## Step 1: Place Your Video File

1. Your video file should be placed in this folder:
   ```
   saas-frontend/public/videos/background.mp4
   ```

2. The `videos` folder has been created for you in the `public` directory.

3. Simply copy your video file into that folder and name it `background.mp4`

## Step 2: Video Requirements

- **Format**: MP4 (H.264 codec recommended)
- **Recommended size**: Keep under 10MB for good loading performance
- **Recommended resolution**: 1920x1080 (Full HD) is sufficient
- **Duration**: 10-30 seconds (it will loop automatically)

## Step 3: Verify It Works

After placing your video file:
1. The app will automatically reload (if npm start is running)
2. You should see your video playing in the background with low opacity
3. If the video doesn't appear, check the browser console for errors

## Alternative: If You Don't Have a Video Yet

If you don't have a video file ready, you can:
1. **Remove the video temporarily** - The purple sphere looks great on its own!
2. **Use a free stock video** from:
   - Pexels Videos (https://www.pexels.com/videos/)
   - Pixabay (https://pixabay.com/videos/)
   - Coverr (https://coverr.co/)
   
   Search for terms like "space", "particles", "abstract", or "technology"

## For Production Deployment

When you're ready to deploy, consider:
- **Cloudinary**: Free tier, easy setup
- **AWS S3 + CloudFront**: Professional CDN solution
- **Vercel Blob Storage**: If deploying on Vercel

For now, the local file in `public/videos/` works perfectly for development!
