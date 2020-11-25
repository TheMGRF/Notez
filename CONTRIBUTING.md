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
