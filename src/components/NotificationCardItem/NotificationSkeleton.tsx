import { Card, CardContent, Skeleton } from '@mui/material'

function NotificationSkeleton({ totalCards = 1 }: { totalCards?: number }) {
  const renderSkeletonCards = () => {
    const liArray = []

    for (let i = 0; i < totalCards; i++) {
      liArray.push(
        <Card
          key={i}
          sx={{
            width: '100%',
            minWidth: 200,
            maxWidth: 400
          }}
        >
          <Skeleton animation="wave" variant="rectangular" height={200} />

          <CardContent
            sx={{
              width: '100%',
              minWidth: 200
            }}
          >
            <Skeleton animation="wave" height={20} width="80%" />
            <Skeleton animation="wave" height={12} width="60%" />
            <Skeleton animation="wave" height={12} width="40%" />
          </CardContent>
        </Card>
      )
    }

    return liArray
  }

  return <>{renderSkeletonCards()}</>
}

export default NotificationSkeleton
