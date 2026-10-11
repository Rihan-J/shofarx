$images = @(
  "C:\Users\n2707\Downloads\goodsgaadi.webp",
  "C:\Users\n2707\Downloads\hhmart billing.webp",
  "C:\Users\n2707\Downloads\hhmart dashboard.webp",
  "C:\Users\n2707\Downloads\No Due Certificate Generator(PESIAMS).webp",
  "C:\Users\n2707\Downloads\nodue_tj0xfh.webp",
  "C:\Users\n2707\Downloads\Personal Portfolio.webp",
  "C:\Users\n2707\Downloads\prizzo.webp",
  "C:\Users\n2707\Downloads\tetcyee billing.webp",
  "C:\Users\n2707\Downloads\tetcyee website.webp",
  "C:\Users\n2707\Downloads\Time Table PWA(PESIAMS).webp"
)
$dest = "C:\Users\n2707\Downloads\shofarx\my-portfolio-main\public\showcase"
if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Force -Path $dest }

foreach ($img in $images) {
  if (Test-Path $img) {
    $newName = (Split-Path $img -Leaf) -replace ' ', '_'
    Copy-Item $img -Destination "$dest\$newName"
    Write-Host "Copied $newName"
  } else {
    Write-Host "Not found: $img"
  }
}
