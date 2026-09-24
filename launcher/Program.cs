using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace CyberNest
{
    static class Program
    {
        private static HttpListener _listener;
        private static string _baseDir;
        private static int _port;

        [STAThread]
        static void Main(string[] args)
        {
            try
            {
                string exePath = AppDomain.CurrentDomain.BaseDirectory;
                _baseDir = Path.Combine(exePath, "dist");
                if (!Directory.Exists(_baseDir))
                {
                    _baseDir = Path.Combine(Directory.GetCurrentDirectory(), "dist");
                }

                if (!Directory.Exists(_baseDir) || !File.Exists(Path.Combine(_baseDir, "index.html")))
                {
                    MessageBox.Show(
                        "未找到前端静态构建产物 (dist/index.html)。\n请先执行 npm run build 进行构建。",
                        "CyberNest 启动提示",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Warning
                    );
                    return;
                }

                _port = GetAvailablePort(14201);
                string url = "http://127.0.0.1:" + _port + "/";

                StartServer(url);

                Process appProcess = LaunchAppWindow(url);
                if (appProcess != null)
                {
                    appProcess.WaitForExit();
                }
                else
                {
                    Process.Start(url);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("启动异常: " + ex.Message, "CyberNest 错误", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                StopServer();
            }
        }

        private static int GetAvailablePort(int defaultPort)
        {
            try
            {
                TcpListener listener = new TcpListener(IPAddress.Loopback, defaultPort);
                listener.Start();
                listener.Stop();
                return defaultPort;
            }
            catch
            {
                TcpListener listener = new TcpListener(IPAddress.Loopback, 0);
                listener.Start();
                int port = ((IPEndPoint)listener.LocalEndpoint).Port;
                listener.Stop();
                return port;
            }
        }

        private static void StartServer(string prefix)
        {
            _listener = new HttpListener();
            _listener.Prefixes.Add(prefix);
            _listener.Start();

            ThreadPool.QueueUserWorkItem(state =>
            {
                while (_listener != null && _listener.IsListening)
                {
                    try
                    {
                        var context = _listener.GetContext();
                        ThreadPool.QueueUserWorkItem(c => ProcessRequest((HttpListenerContext)c), context);
                    }
                    catch
                    {
                        break;
                    }
                }
            });
        }

        private static void ProcessRequest(HttpListenerContext context)
        {
            try
            {
                string rawUrl = context.Request.Url.AbsolutePath.TrimStart('/');
                if (string.IsNullOrEmpty(rawUrl)) rawUrl = "index.html";

                string filePath = Path.Combine(_baseDir, rawUrl.Replace('/', Path.DirectorySeparatorChar));
                if (!File.Exists(filePath))
                {
                    filePath = Path.Combine(_baseDir, "index.html");
                }

                byte[] buffer = File.ReadAllBytes(filePath);
                string ext = Path.GetExtension(filePath).ToLower();
                string mime = "application/octet-stream";
                if (ext == ".html" || ext == ".htm") mime = "text/html; charset=utf-8";
                else if (ext == ".js" || ext == ".mjs") mime = "application/javascript; charset=utf-8";
                else if (ext == ".css") mime = "text/css; charset=utf-8";
                else if (ext == ".svg") mime = "image/svg+xml";
                else if (ext == ".png") mime = "image/png";
                else if (ext == ".jpg" || ext == ".jpeg") mime = "image/jpeg";
                else if (ext == ".ico") mime = "image/x-icon";
                else if (ext == ".json") mime = "application/json; charset=utf-8";
                else if (ext == ".woff2") mime = "font/woff2";
                else if (ext == ".woff") mime = "font/woff";
                else if (ext == ".ttf") mime = "font/ttf";

                context.Response.ContentType = mime;
                context.Response.ContentLength64 = buffer.Length;
                context.Response.AddHeader("Cache-Control", "no-cache");
                context.Response.OutputStream.Write(buffer, 0, buffer.Length);
                context.Response.OutputStream.Close();
            }
            catch
            {
                try
                {
                    context.Response.StatusCode = 500;
                    context.Response.Close();
                }
                catch { }
            }
        }

        private static Process LaunchAppWindow(string url)
        {
            string[] browsers = new string[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Microsoft\Edge\Application\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Microsoft\Edge\Application\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Google\Chrome\Application\chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Google\Chrome\Application\chrome.exe"),
            };

            foreach (string browser in browsers)
            {
                if (File.Exists(browser))
                {
                    ProcessStartInfo psi = new ProcessStartInfo
                    {
                        FileName = browser,
                        Arguments = string.Format("--app=\"{0}\" --window-size=1280,820", url),
                        UseShellExecute = false
                    };
                    return Process.Start(psi);
                }
            }
            return null;
        }

        private static void StopServer()
        {
            try
            {
                if (_listener != null && _listener.IsListening)
                {
                    _listener.Stop();
                    _listener.Close();
                }
            }
            catch { }
        }
    }
}
