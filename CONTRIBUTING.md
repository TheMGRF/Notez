## Contributing
### Clone repository to local
```shell script
cd path/to/target/directory
git clone https://github.com/TheMGRF/Notez.git && cd Notez
```

### Push existing repo
```shell script
git remote add origin https://github.com/TheMGRF/Notez.git
git push -u origin master
```

### Making a new branch
To create a new branch to work on your own features run:
```shell script
git checkout -b new-branch
```

### Commiting and pushing to master
To see the status of your altered files you can use:
```shell script
git status
```
To commit your changes and push to the remote repository type the following commands. <i>The "." in `git add` means add all files. Optionally you can instead add files individually `git add /assets/js/...`</i>
```shell script
git add .
git commit -m "<message>"
git push origin master
```

#### Merging master into your branch
Make sure to have committed all your changes and run:
```shell script
git checkout master
git pull
git checkout your-branch
git merge master
```

#### Merging your branch into master
Make sure to have committed all your changes and run:
```shell script
git checkout master
git merge your-branch
git push
```
**OR** alternatively use the [GitHub PR](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/about-pull-requests) feature to merge your branch!
