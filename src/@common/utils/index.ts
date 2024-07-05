import { basename, extname } from "path";

export function getUniqueFileName(file: Express.Multer.File, id: number) {
  const ext = extname(file.originalname) // 확장자 추출
  const fileName = basename(file.originalname, ext) + id + ext;
  // 파일 이름에서 확장자를 제외한 부분에 id를 추가하고 확장자를 붙여 고유한 파일 이름 생성

  return fileName;
}
