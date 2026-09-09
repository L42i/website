# L42i Website


## Getting Started

1) Make sure the Node Package Manager is installed.
    - On Debian run `sudo apt install npm`

2) Clone the repository and cd to its root directory.

    $ git clone https://github.com/L42i/website.git
    $ cd website
 
3) Run `npm install` 


## Developing

For developing, run `npm run dev --host` in the root directory.
The website runs at `localhost:4321` with live updates.

Adding the `--host` flag allows you to also test the site from other devices to ensure it runs well on smartphones.

*This mode does not create the actual website - it is just for developing.*


Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.
Any static assets, like images, can be placed in the `public/` directory.



## Deploying

1) Run `npm run build` in the root directory.
    - This creates the static website in the directory `dist`.


2) Send the contents of `dist` to the server using scp:    
    - `scp -O -r dist/* l42imusic@l42i.music.gatech.edu:/httpdocs/`
    - This command can also be used by running `bash deploy.sh`
    - The server will ask for credentials - **works only from campus (not Eduroam) or with VPN for GaTech**!


 