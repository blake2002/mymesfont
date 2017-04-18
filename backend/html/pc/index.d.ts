
interface Window {
    __md5Array: { path: string, md5: string }[];
}

// 页面文件相对的md5
interface NodeRequire {
    async: (url: string, cb: (page: any) => void) => void;
}

