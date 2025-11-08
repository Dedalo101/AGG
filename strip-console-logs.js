/**
 * Production Build Utility
 * Removes console.log statements and prepares code for production
 * Run with: node strip-console-logs.js
 */

const fs = require('fs');
const path = require('path');

const JS_FILES_TO_PROCESS = [
    'js/chat-system.js',
    'js/admin-dashboard.js',
    'js/property-matching.js',
    'sw.js'
];

const BACKUP_DIR = '.backup-console-logs';

function stripConsoleLogs(content) {
    // Remove console.log, console.warn, console.error, but keep console.error in catch blocks
    const lines = content.split('\n');
    let removedCount = 0;
    const processedLines = lines.map(line => {
        // Skip if line is in a catch block (keep error logging)
        if (line.trim().startsWith('console.error') && 
            (line.includes('catch') || line.includes('Error'))) {
            return line;
        }
        
        // Remove standalone console statements (handle indented lines)
        if (line.trim().startsWith('console.log') || 
            line.trim().startsWith('console.warn') ||
            line.trim().startsWith('console.error')) {
            removedCount++;
            return '// ' + line.trim() + ' // Removed for production';
        }
        
        return line;
    });
    
    // Return both the processed content and the count
    return { content: processedLines.join('\n'), removedCount };
}

function createBackup(filePath, content) {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    
    const backupPath = path.join(BACKUP_DIR, path.basename(filePath));
    fs.writeFileSync(backupPath, content, 'utf8');
    console.log(`✅ Backup created: ${backupPath}`);
}

function processFile(filePath) {
    const fullPath = path.resolve(filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️  File not found: ${filePath}`);
        return;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Create backup
    createBackup(filePath, content);
    
    // Process content
    const result = stripConsoleLogs(content);
    const processedContent = result.content;
    const removedCount = result.removedCount;
    
    if (removedCount > 0) {
        fs.writeFileSync(fullPath, processedContent, 'utf8');
        console.log(`✅ Processed ${filePath}: Removed ${removedCount} console statements`);
    } else {
        console.log(`✓  ${filePath}: No console statements to remove`);
    }
}

function restoreFromBackup() {
    if (!fs.existsSync(BACKUP_DIR)) {
        console.error('❌ No backup directory found');
        return;
    }
    
    const backupFiles = fs.readdirSync(BACKUP_DIR);
    backupFiles.forEach(file => {
        const backupPath = path.join(BACKUP_DIR, file);
        const originalPath = path.resolve(file.startsWith('js/') ? file : `js/${file}`);
        
        if (fs.existsSync(backupPath)) {
            const content = fs.readFileSync(backupPath, 'utf8');
            fs.writeFileSync(originalPath, content, 'utf8');
            console.log(`✅ Restored: ${originalPath}`);
        }
    });
    
    console.log('\n✅ All files restored from backup');
}

// Main execution
const args = process.argv.slice(2);

if (args.includes('--restore')) {
    console.log('🔄 Restoring files from backup...\n');
    restoreFromBackup();
} else if (args.includes('--help')) {
    console.log(`
Production Console Log Stripper
================================

Usage:
  node strip-console-logs.js           - Strip console logs from production files
  node strip-console-logs.js --restore - Restore original files from backup
  node strip-console-logs.js --help    - Show this help message

Files processed:
${JS_FILES_TO_PROCESS.map(f => `  - ${f}`).join('\n')}

Note: Original files are backed up to ${BACKUP_DIR}/
    `);
} else {
    console.log('🚀 Stripping console logs for production build...\n');
    JS_FILES_TO_PROCESS.forEach(processFile);
    console.log('\n✅ Production optimization complete!');
    console.log(`📦 Backups saved to: ${BACKUP_DIR}/`);
    console.log('\nTo restore original files, run:');
    console.log('  node strip-console-logs.js --restore');
}
