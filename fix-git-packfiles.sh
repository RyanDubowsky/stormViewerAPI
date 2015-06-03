#!/bin/bash

packlist=`mktemp`
git gc 2>&1 |
  grep '^warning: packfile .* cannot be accessed$' |
    cut -d' ' -f3 |
      sort -u > $packlist
packs_count=`wc -l < $packlist`

temp=`mktemp`
backup=`mktemp -d`
rm $temp

unpacked=0
backed=0
while read pack ; do
  mv $pack $temp || break
  if ! git unpack-objects < $temp ; then
    echo >&2 "error: unpacking has failed, restoring packfile \`$pack'..."
    if ! mv $temp $pack ; then
      echo >&2 "error: cannot restore the packfile from \`$temp'"
    fi
    break
  fi
  let ++unpacked
  mkdir -p $backup/`dirname $pack`
  if ! mv $temp $backup/$pack ; then
    echo >&2 "error: unpacking finished well, but cannot backup \`$temp' to \`$backup/$pack/'"
    break
  fi
  let ++backed
done < <(head $packlist)

echo >&2 "$unpacked of $packs_count are unpacked, $backed of them are backed up to \`$backup/.git'"

rm $packlist || exit 1

if [ $backed -eq $packs_count ] ; then
  echo >&2 'good work!'
else
  exit 1
fi