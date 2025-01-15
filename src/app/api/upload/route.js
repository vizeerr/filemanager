// import { handleUpload} from '@vercel/blob/client'
// import { NextResponse } from 'next/server'

// export async function POST(request){
//   const body = (await request.json())

//   try {
//     const jsonResponse = await handleUpload({
//       body,
//       request,
//       onBeforeGenerateToken: async (pathname) => {
//         // Implement your own security measures here
//         return { allowedContentTypes: ['image/jpeg', 'image/png', 'application/pdf'] }
//       },
//       onUploadCompleted: async ({ blob, tokenPayload }) => {
//         console.log('blob upload completed', blob, tokenPayload)
        
//       },
//     })

//     return NextResponse.json(jsonResponse)
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error).message },
//       { status: 400 }
//     )
//   }
// }

