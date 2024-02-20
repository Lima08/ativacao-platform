import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  Fab,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Toolbar,
  Typography
} from '@mui/material'
export default function Homepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  return (
    <div>
      <main>
        <AppBar position="sticky" sx={{ display: { xs: 'block', md: 'none' } }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuToggle}
            >
              <MenuIcon />
            </IconButton>
            <Link href="/">
              <Box
                component="img"
                src="/logo-ativacao-white.png"
                alt="Logo da Empresa"
                width={150}
                height={40}
              />
            </Link>
          </Toolbar>
        </AppBar>
        <AppBar
          position="sticky"
          sx={{ px: 4, display: { xs: 'none', md: 'block' } }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Link href="/">
                <Image
                  src="/logo-ativacao-white.png"
                  alt="Logo da Empresa"
                  width={150}
                  height={50}
                />
              </Link>
            </Typography>
            <Button color="inherit">
              <Link href="/login">Login</Link>
            </Button>
            <Button color="inherit">
              <Link href="/create-account">Criar conta</Link>
            </Button>
          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={isMenuOpen} onClose={handleMenuToggle}>
          <List>
            <ListItem onClick={handleMenuToggle}>
              <Link href="/login">
                <ListItemText primary="Login" />
              </Link>
            </ListItem>
            <ListItem onClick={handleMenuToggle}>
              <Link href="/create-account">
                <ListItemText primary="Criar conta" />
              </Link>
            </ListItem>
          </List>
        </Drawer>

        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid
            xs={12}
            sm={12}
            item
            sx={{
              position: 'relative',
              height: '100vh',
              overflow: 'hidden',
              display: 'flex'
            }}
          >
            <Image
              src="/hero-home.jpg"
              alt="Hero image"
              fill
              style={{ objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'relative',
                top: '40%',
                textAlign: 'center',
                color: 'white',
                width: '100vw'
              }}
              className="relative z-10 w-full "
            >
              <Typography
                variant="h4"
                align="left"
                color="textPrimary"
                gutterBottom
                sx={{
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
                  color: '#ffffff',
                  padding: '8px',
                  textAlign: 'center',
                  position: 'relative',
                  fontFamily: 'Roboto sans-serif'
                }}
              >
                SEJA BEM VINDO AO FUTURO!
                <span
                  className="hidden md:block"
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '500px',
                    height: '3px',
                    borderRadius: '100%',
                    background: '#dbb42c',
                    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)'
                  }}
                ></span>
              </Typography>
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            sx={{
              height: '100vh',
              overflow: 'hidden',
              display: 'flex'
            }}
          >
            <Paper sx={{ width: '100%', height: '100vh' }}>
              <section className="h-full flex flex-col justify-center p-2 md:p-6 gap-4 md:flex-row-reverse md:justify-center items-center">
                <div className="w-full md:w-[50%] flex justify-center items-center my-4">
                  <Image
                    src="/logo-ativacao.png"
                    priority
                    alt="Logo Ativação Tec"
                    width={500}
                    height={400}
                    style={{
                      objectFit: 'cover',
                      width: '80%',
                      borderRadius: 10,
                      height: '100%'
                    }}
                  />
                </div>
                <div className="w-full md:block md:w-[50%] ">
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 2,
                      textAlign: 'center',
                      fontFamily: 'roboto sans-serif'
                    }}
                  >
                    Quem somos
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      textAlign: 'center',
                      fontFamily: 'roboto sans-serif'
                    }}
                  >
                    A ATIVAÇÃO TEC foi desenvolvida com o objetivo de aprimorar
                    a experiência dos representantes comerciais, tornando o
                    relacionamento entre fornecedor e revendedor mais técnico e
                    eficiente. Em muitos casos, confiar apenas no
                    &quot;feeling&quot; pode ser arriscado, por isso nossa
                    plataforma realiza o processamento de dados para apresentar
                    as informações de forma didática, facilitando as tomadas de
                    decisão. Além disso, nossa ferramenta permite que o
                    administrador conceda acesso controlado aos colaboradores de
                    interesse, possibilitando interações por meio de ferramentas
                    de treinamento, campanhas e um mural de avisos. Todas essas
                    opções visam oferecer um atendimento mais completo,
                    auxiliando também na capacitação da equipe e no suporte ao
                    cliente.
                  </Typography>
                </div>
              </section>
            </Paper>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            sx={{
              height: '100vh',
              overflow: 'hidden',
              display: 'flex'
            }}
          >
            <section className="bg-gray-100 flex flex-col justify-start p-2 md:p-6 gap-4 md:gap-8  md:flex-row-reverse md:justify-center items-center">
              <div className="w-full  md:w-[50%] ">
                <Typography
                  variant="h4"
                  sx={{
                    mb: 2,
                    textAlign: 'center',
                    fontFamily: 'roboto sans-serif'
                  }}
                >
                  Como otimizar seu resultado?
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                    textAlign: 'center',
                    fontFamily: 'roboto sans-serif'
                  }}
                >
                  Apostar no &quot;feeling&quot; e na experiência adquirida
                  durante a carreira está sujeita a grande chance de erros. Em
                  contrapartida, o uso da análise de dados garante escolhas de
                  sucesso com mais facilidade, precisão e agilidade! Essas
                  soluções tecnológicas estão criando uma nova forma de
                  gerenciar pequenos, médios e grandes empreendimentos.
                  Informações precisas aumentam o sucesso de investimentos e dos
                  lucros.
                </Typography>
              </div>
              <div className="w-full md:w-[50%] ">
                <Image
                  src="/section-image-home.jpeg"
                  alt="Imagem de um homem trabalhando com um notebook"
                  width={500}
                  height={400}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    borderRadius: 10,
                    height: '100%'
                  }}
                />
              </div>
            </section>
          </Grid>
        </Grid>
      </main>

      <footer style={{ width: '100%', background: '#171716' }}>
        <Container
          maxWidth="xl"
          sx={{
            py: 1,
            textAlign: 'center',
            color: '#000000',
            width: '100%',
            backgroundColor: '#31a252'
          }}
        >
          <Typography variant="body2" color="#000000">
            <LocationOnOutlinedIcon className="h-4" />
            R. Icaraí, 538 - Caiçaras - Belo Horizonte - MG, 30770-584 -
            Showroom
          </Typography>
          <Fab
            target="_blank"
            href="https://api.whatsapp.com/send?phone=5531993390213&text=Ol%C3%A1,%20vim%20pelo%20site%20da%20Ativa%C3%A7%C3%A3o%20e%20gostaria%20de%20tirar%20algumas%20d%C3%BAvidas.%20"
            sx={{
              position: 'fixed',
              bottom: 26,
              right: 26,
              backgroundColor: '#31a252 !important',
              '&:hover': {
                backgroundColor: '#31a252 !important'
              }
            }}
          >
            <WhatsAppIcon style={{ color: 'white' }}   />
          </Fab>
        </Container>
        <Container
          maxWidth="md"
          sx={{
            py: 1,
            textAlign: 'center',
            color: '#ffffff',
            width: '100vw'
          }}
        >
          <IconButton
            color="inherit"
            href="https://www.facebook.com/profile.php?id=61550712443655&locale=pt_BR"
            target="_blank"
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            color="inherit"
            href="https://www.instagram.com/ativacaogroup/"
            target="_blank"
          >
            <InstagramIcon />
          </IconButton>
          <Typography variant="body2" color="#ffffff">
            &copy; 2023 All Rights Reserved By Ativação Group
          </Typography>
        </Container>
      </footer>
    </div>
  )
}
