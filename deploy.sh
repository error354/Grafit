npm run build

cd dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:error354/grafitt.git main:gh-pages

cd ..