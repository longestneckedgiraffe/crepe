import { useState } from "react";

interface FileItem {
  name: string;
  action?: () => void;
}

interface FolderData {
  files: FileItem[];
}

const folders: Record<string, FolderData> = {
  blogs: {
    files: [{ name: "nothing yet" }],
  },
  about: {
    files: [{ name: "nothing yet" }],
  },
  contact: {
    files: [
      {
        name: "contact@ridhwanzaman.me",
        action: () => window.open("mailto:contact@ridhwanzaman.me"),
      },
    ],
  },
};

export default function FileExplorer() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderName)) {
        next.delete(folderName);
      } else {
        next.add(folderName);
      }
      return next;
    });
  };

  const handleFileClick = (file: FileItem) => {
    if (file.action) {
      file.action();
    }
  };

  return (
    <div className="text-[1.1rem] tracking-[-0.02em] font-light select-none">
      {Object.entries(folders).map(([folderName, folder]) => {
        const isExpanded = expandedFolders.has(folderName);
        return (
          <div key={folderName}>
            <div
              onClick={() => toggleFolder(folderName)}
              className="flex items-center cursor-pointer text-[#878b89] hover:text-white transition-colors duration-200 py-1"
            >
              <span className="w-5 opacity-50">{isExpanded ? "–" : "+"}</span>
              <span>{folderName}/</span>
            </div>
            <div
              className={`ml-5 grid transition-all duration-300 ease-out ${
                isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                {folder.files.map((file, index) => (
                  <div
                    key={index}
                    onClick={() => handleFileClick(file)}
                    className={`flex items-center py-1 text-[#878b89] transition-colors duration-200 ${
                      file.action ? "cursor-pointer hover:text-white" : ""
                    }`}
                  >
                    <span className="w-5 opacity-50">└</span>
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
