set runtimepath+=~/.vim_runtime
set exrc
set secure
source ~/.vim_runtime/vimrcs/basic.vim
source ~/.vim_runtime/vimrcs/filetypes.vim
source ~/.vim_runtime/vimrcs/plugins_config.vim
source ~/.vim_runtime/vimrcs/extended.vim

try
source ~/.vim_runtime/my_configs.vim
catch
endtry

" vim-plug
call plug#begin('~/.vim/plugged')

" plugin section
au VimEnter * :silent! !xmodmap -e 'clear Lock' -e 'keycode 0x42 = Escape'
au VimLeave * :silent! !xmodmap -e 'clear Lock' -e 'keycode 0x42 = Caps_Lock'
"Plug 'terryma/vim-multiple-cursors'
Plug 'pangloss/vim-javascript'
"Plug 'leafgarland/typescript-vim'
Plug 'maxmellon/vim-jsx-pretty'
Plug 'prettier/vim-prettier', { 'do': 'yarn install', 'for': ['javascript', 'typescript', 'css', 'less', 'scss', 'json', 'graphql', 'markdown', 'vue', 'yaml', 'html'] }
let g:prettier#autoformat = 0
autocmd BufWritePre *.js,*.jsx,*.mjs,*.ts,*.tsx,*.css,*.less,*.scss,*.json,*.graphql,*.md,*.vue,*.yaml,*.html PrettierAsync
" end vim-plug
call plug#end()
