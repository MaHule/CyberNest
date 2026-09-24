export type EnvironmentType = 'java' | 'python' | 'proxy' | 'wsl' | 'custom';

export interface ToolEnvironment {
  id: string;
  name: string;                         // 启动环境名称, e.g. "Java 8 (Oracle JDK)", "Python 3.10 (SecEnv)"
  type: EnvironmentType;                // 环境类型: java, python, proxy, wsl, custom
  binPath?: string;                     // 解释器或可执行程序路径 (如 C:\Program Files\Java\jdk1.8.0_202\bin\java.exe 或 python)
  extraArgs?: string;                   // 预设附加参数 (如 -Xmx2g, -Dfile.encoding=UTF-8, -u)
  envVars?: Record<string, string>;     // 自定义注入环境变量 (如 JAVA_HOME, PYTHONPATH, HTTP_PROXY, ALL_PROXY)
  description?: string;                 // 备注用途说明
  isDefault?: boolean;                  // 是否设为该类型的默认推荐环境
  createdAt: string;
  updatedAt: string;
}
