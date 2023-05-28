import * as React from 'react'

import { CardActionArea } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'

type CardProps = {
  imageUrl: string
  name: string
  description: string
  data?: string
}

export default function CardItem({
  imageUrl,
  name,
  description,
  data
}: CardProps) {
  return (
    <Card sx={{ width: 200 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="auto"
          width="auto"
          image={imageUrl}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
